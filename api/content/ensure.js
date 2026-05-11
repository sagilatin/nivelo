import { createClient } from '@supabase/supabase-js'
import {
  LEVELS,
  buildSummaryRows,
  buildTranslationRows,
  generateArticleContent,
  generateQuiz,
  isPracticeLanguage,
} from '../../server/contentGeneration.js'

export const config = { maxDuration: 300 }

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const articleId = String(req.query.articleId || req.query.id || '').trim()
  const lang = String(req.query.lang || '').toLowerCase().trim()
  if (!articleId || !isPracticeLanguage(lang)) {
    return res.status(400).json({ error: 'Provide ?articleId=<id>&lang=<es|fr|de|it|ja|en>' })
  }

  res.setHeader('Cache-Control', 'no-store')

  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  let cached
  try {
    cached = await readBundle(supabase, articleId, lang)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
  if (hasAllLevels(cached.article_translations)) {
    return res.status(200).json({ status: 'cached', articleId, lang, ...cached })
  }

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('id, source_lang, raw_title, raw_description')
    .eq('id', articleId)
    .maybeSingle()

  if (articleError) return res.status(500).json({ error: articleError.message })
  if (!article) return res.status(404).json({ error: 'Article not found' })

  try {
    const generated = await generateArticleContent(article, lang)
    const quiz = await generateQuiz(article, generated.B1, lang)
    const transRows = buildTranslationRows(article.id, lang, generated)
    const sumRows = buildSummaryRows(article.id, lang, generated)

    const { error: transError } = await supabase
      .from('article_translations')
      .upsert(transRows, { onConflict: 'article_id,lang,level' })
    if (transError) throw transError

    if (sumRows.length) {
      const { error: sumError } = await supabase
        .from('summary_translations')
        .upsert(sumRows, { onConflict: 'article_id,lang,target_lang' })
      if (sumError) throw sumError
    }

    if (quiz?.length) {
      const { error: quizError } = await supabase
        .from('quizzes')
        .upsert(
          { article_id: article.id, lang, level: 'B1', questions: quiz },
          { onConflict: 'article_id,lang,level' },
        )
      if (quizError) throw quizError
    }

    return res.status(200).json({
      status: 'created',
      articleId,
      lang,
      article_translations: transRows,
      summary_translations: sumRows,
      quizzes: quiz?.length ? [{ lang, questions: quiz }] : [],
    })
  } catch (e) {
    return res.status(502).json({ error: 'translation provider failed', detail: e.message })
  }
}

async function readBundle(supabase, articleId, lang) {
  const [translations, summaries, quizzes] = await Promise.all([
    supabase
      .from('article_translations')
      .select('level, lang, headline, summary, body')
      .eq('article_id', articleId)
      .eq('lang', lang),
    supabase
      .from('summary_translations')
      .select('lang, target_lang, text')
      .eq('article_id', articleId)
      .eq('lang', lang),
    supabase
      .from('quizzes')
      .select('lang, questions')
      .eq('article_id', articleId)
      .eq('lang', lang),
  ])

  for (const result of [translations, summaries, quizzes]) {
    if (result.error) throw result.error
  }

  return {
    article_translations: translations.data || [],
    summary_translations: summaries.data || [],
    quizzes: quizzes.data || [],
  }
}

function hasAllLevels(rows) {
  const existing = new Set((rows || []).map((row) => row.level))
  return LEVELS.every((level) => existing.has(level))
}
