import { useEffect, useState } from 'react'
import { supabase, hasSupabase } from '../lib/supabase.js'
import { articles as seedArticles, getArticleContent as getSeedByLevel } from './articles.js'

// Loads articles. Tries Supabase first; falls back to the hardcoded seed
// articles when there's no Supabase client configured, the fetch fails, or
// the table is empty (so a fresh deploy still has *something* to show before
// the first cron run).
//
// Seed articles are Spanish-only and get an implicit `articleLang: 'es'`.
export function useArticles() {
  const [state, setState] = useState({
    articles: prepareSeed(seedArticles),
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
            article_translations ( level, lang, headline, summary, body ),
            summary_translations ( lang, target_lang, text ),
            quizzes ( lang, questions )
          `)
          .order('pub_date', { ascending: false })

        if (cancelled) return
        if (error) throw error
        if (!data?.length) {
          setState({ articles: prepareSeed(seedArticles), source: 'seed-empty', loading: false, error: null })
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
          setState({
            articles: prepareSeed(seedArticles),
            source: 'seed-error',
            loading: false,
            error: e.message,
          })
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

// Returns { headline, body, summary } for the article in the requested
// practice language and CEFR level. Returns null when content for that
// practice language hasn't been generated yet — callers should render a
// "content loading" placeholder.
export function getArticleContent(article, level, practiceLang = 'es') {
  if (!article) return null
  // Seed articles store content flat (byLevel) and are Spanish-only.
  if (article.byLevel && (!article.byLang || !article.byLang[practiceLang])) {
    if ((article.articleLang || 'es') !== practiceLang) return null
    const lvl = getSeedByLevel(article, level)
    return lvl ? { ...lvl, summary: article.summary } : null
  }
  // Supabase-shaped articles use byLang[lang].byLevel[level].
  const langPack = article.byLang?.[practiceLang]
  if (!langPack) return null
  const map = langPack.byLevel || {}
  if (map[level]) return { ...map[level], summary: langPack.summary }
  // Fall back to the closest neighbouring level we have.
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const idx = LEVELS.indexOf(level)
  for (let d = 1; d < LEVELS.length; d++) {
    const lo = LEVELS[idx - d]
    const hi = LEVELS[idx + d]
    if (lo && map[lo]) return { ...map[lo], summary: langPack.summary }
    if (hi && map[hi]) return { ...map[hi], summary: langPack.summary }
  }
  return null
}

// Returns the summary line for a card in the chosen practice language, or
// null if it isn't available.
export function getArticleSummary(article, practiceLang = 'es') {
  if (!article) return null
  if (article.byLang?.[practiceLang]?.summary) return article.byLang[practiceLang].summary
  if ((article.articleLang || 'es') === practiceLang) return article.summary || ''
  return null
}

// Returns the quiz for the article in the practice language, or null.
export function getArticleQuiz(article, practiceLang = 'es') {
  if (!article) return null
  if (article.byLang?.[practiceLang]?.quiz) return article.byLang[practiceLang].quiz
  if ((article.articleLang || 'es') === practiceLang) return article.quiz || null
  return null
}

export function mergeArticleTranslation(article, payload) {
  if (!article || !payload?.lang) return article
  const byLang = cloneByLang(article.byLang || {})
  const pack = (byLang[payload.lang] ||= { byLevel: {}, summary: '', summaryTranslations: {} })

  for (const t of payload.article_translations || []) {
    pack.byLevel[t.level] = { headline: t.headline, body: t.body || [] }
    if (!pack.summary && t.summary) pack.summary = t.summary
  }
  for (const s of payload.summary_translations || []) {
    pack.summaryTranslations[s.target_lang || s.lang] = s.text
  }
  for (const q of payload.quizzes || []) {
    pack.quiz = q.questions
  }

  return {
    ...article,
    byLang,
    articleLang: article.articleLang || payload.lang,
    summary: article.summary || pack.summary,
  }
}

// Decorate seed articles with `articleLang: 'es'` so callers can ask "is
// content in MY language available?" uniformly across seed + supabase.
function prepareSeed(list) {
  return list.map((a) => (a.articleLang ? a : { ...a, articleLang: 'es' }))
}

// Convert a Supabase row (with its joined tables) into the shape the React
// components expect. Each row now carries content for every practice
// language that the cron has generated; the client picks the right one based
// on the user's `targetLang`.
function toClientShape(row) {
  const byLang = {}

  for (const t of row.article_translations || []) {
    const lang = t.lang || 'es'
    const pack = (byLang[lang] ||= { byLevel: {}, summary: '', summaryTranslations: {} })
    pack.byLevel[t.level] = { headline: t.headline, body: t.body || [] }
    if (!pack.summary && t.summary) pack.summary = t.summary
  }
  for (const s of row.summary_translations || []) {
    // `target_lang` is the language the summary is translated INTO (interface
    // hint shown under the card). `lang` indicates which article-language pack
    // it belongs to.
    const lang = s.lang || 'es'
    const pack = (byLang[lang] ||= { byLevel: {}, summary: '', summaryTranslations: {} })
    pack.summaryTranslations[s.target_lang || s.lang] = s.text
  }
  for (const q of row.quizzes || []) {
    const lang = q.lang || 'es'
    const pack = (byLang[lang] ||= { byLevel: {}, summary: '', summaryTranslations: {} })
    pack.quiz = q.questions
  }

  // Pick a summary fallback for any card view if no targetLang content exists.
  const firstLang = Object.keys(byLang)[0]
  const fallbackSummary = firstLang ? byLang[firstLang].summary : ''

  // Heuristic: the article's "primary" language is whichever lang the cron
  // wrote first. For Supabase content the client uses byLang directly, so the
  // explicit articleLang is informational.
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
    articleLang: firstLang || 'es',
    byLang,
    // Back-compat fields some components still read directly.
    summary: fallbackSummary,
  }
}

function countryFlag(c) {
  return ({ IL: '🇮🇱', ES: '🇪🇸', US: '🇺🇸', GLOBAL: '🌐', IT: '🇮🇹', FR: '🇫🇷', JP: '🇯🇵' }[c]) || '🌍'
}

function cloneByLang(byLang) {
  return Object.fromEntries(
    Object.entries(byLang).map(([lang, pack]) => [
      lang,
      {
        ...pack,
        byLevel: { ...(pack.byLevel || {}) },
        summaryTranslations: { ...(pack.summaryTranslations || {}) },
      },
    ]),
  )
}
