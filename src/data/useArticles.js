import { useEffect, useState } from 'react'
import { supabase, hasSupabase } from '../lib/supabase.js'
import { articles as seedArticles, getArticleContent as getSeedContent } from './articles.js'

// Loads articles. Tries Supabase first; falls back to the hardcoded seed
// articles when there's no Supabase client configured, the fetch fails, or
// the table is empty (so a fresh deploy still has *something* to show before
// the first cron run).
export function useArticles() {
  const [state, setState] = useState({
    articles: seedArticles,
    source: 'seed',
    loading: hasSupabase,
    error: null,
  })

  useEffect(() => {
    if (!hasSupabase) return
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id, country, source, source_lang, source_url, category, image_seed,
            pub_date, fetched_at,
            article_translations ( level, headline, summary, body ),
            summary_translations ( lang, text ),
            quizzes ( questions )
          `)
          .order('pub_date', { ascending: false })

        if (cancelled) return
        if (error) throw error
        if (!data?.length) {
          setState({ articles: seedArticles, source: 'seed-empty', loading: false, error: null })
          return
        }
        setState({
          articles: data.map(toClientShape),
          source: 'supabase',
          loading: false,
          error: null,
        })
      } catch (e) {
        if (!cancelled) {
          setState({ articles: seedArticles, source: 'seed-error', loading: false, error: e.message })
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  return state
}

// Same lookup helpers exported as before, but operating over the article list
// passed in (so they read from Supabase or seed transparently).
export function findArticleById(list, id) {
  return list.find((a) => a.id === id) || list[0]
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export function getArticleContent(article, level) {
  // Seed articles use article.byLevel; supabase-shaped articles use the same.
  if (article.byLevel) return getSeedContent(article, level)
  return { headline: article.headline || '', body: article.body || [] }
}

// Convert a Supabase row (with its joined tables) into the shape the React
// components expect.
function toClientShape(row) {
  const byLevel = {}
  for (const t of row.article_translations || []) {
    byLevel[t.level] = { headline: t.headline, body: t.body || [], summary: t.summary }
  }
  const summaryTranslations = {}
  for (const s of row.summary_translations || []) {
    summaryTranslations[s.lang] = s.text
  }
  // Pick a reasonable summary/headline default for the card view.
  const fallback = byLevel.B1 || byLevel.A2 || byLevel.A1 || Object.values(byLevel)[0] || {}
  return {
    id: row.id,
    country: row.country,
    flag: countryFlag(row.country),
    source: row.source,
    sourceLang: row.source_lang,
    sourceUrl: row.source_url,
    category: row.category || 'NOTICIAS',
    minutes: 4,
    date: row.pub_date ? new Date(row.pub_date).toLocaleDateString('es') : '',
    imageSeed: row.image_seed || row.id,
    summary: fallback.summary || '',
    summaryTranslations,
    byLevel,
    quiz: row.quizzes?.[0]?.questions || null,
  }
}

function countryFlag(c) {
  return ({ IL: '🇮🇱', ES: '🇪🇸', US: '🇺🇸', GLOBAL: '🌐', IT: '🇮🇹', FR: '🇫🇷', JP: '🇯🇵' }[c]) || '🌍'
}
