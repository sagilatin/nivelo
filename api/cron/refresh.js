// Daily pipeline. Triggered by Vercel cron at 07:00 UTC (≈ 08:00 CET / 09:00 CEST).
//
// Flow per run:
//   1. Fetch RSS for 7 countries × 1–3 sources each.
//   2. Take the 5 most recent items per country.
//   3. Insert raw rows into Supabase.
//   4. Optionally generate a small batch for a requested practice language.
//      The scheduled cron runs fetch-only; user demand fills translations.
//   5. Update pipeline_status with the run summary.
//
// All secrets are server-side env vars. Run manually via:
//   GET /api/cron/refresh?token=<CRON_TOKEN>&lang=fr
//   GET /api/cron/refresh?token=<CRON_TOKEN>&lang=all

import { createClient } from '@supabase/supabase-js'
import { XMLParser } from 'fast-xml-parser'
import {
  LEVELS,
  PRACTICE_LANGUAGES,
  buildSummaryRows,
  buildTranslationRows,
  generateArticleContent,
  generateQuiz,
} from '../../server/contentGeneration.js'

export const config = { maxDuration: 300 } // 5 minutes — Gemini calls add up.

const FEEDS = [
  // Israel
  { country: 'IL',     source: 'Haaretz',         lang: 'EN', url: 'https://www.haaretz.com/cmlink/1.628765' },
  { country: 'IL',     source: 'Times of Israel', lang: 'EN', url: 'https://www.timesofisrael.com/feed/' },
  { country: 'IL',     source: 'Jerusalem Post',  lang: 'EN', url: 'https://www.jpost.com/rss/rssfeedsheadlines.aspx' },
  // España
  { country: 'ES',     source: 'El País',         lang: 'ES', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' },
  { country: 'ES',     source: 'El Mundo',        lang: 'ES', url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml' },
  // USA
  { country: 'US',     source: 'NYT',             lang: 'EN', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
  { country: 'US',     source: 'Washington Post', lang: 'EN', url: 'https://feeds.washingtonpost.com/rss/world' },
  // Global
  { country: 'GLOBAL', source: 'BBC',             lang: 'EN', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
  { country: 'GLOBAL', source: 'Reuters',         lang: 'EN', url: 'https://feeds.reuters.com/reuters/topNews' },
  // Italia
  { country: 'IT',     source: 'La Repubblica',   lang: 'IT', url: 'https://www.repubblica.it/rss/homepage/rss2.0.xml' },
  { country: 'IT',     source: 'ANSA',            lang: 'EN', url: 'https://www.ansa.it/sito/ansait_rss.xml' },
  // Francia
  { country: 'FR',     source: 'Le Monde',        lang: 'FR', url: 'https://www.lemonde.fr/rss/une.xml' },
  { country: 'FR',     source: 'France 24',       lang: 'EN', url: 'https://www.france24.com/en/rss' },
  // Japón
  { country: 'JP',     source: 'NHK',             lang: 'JP', url: 'https://www3.nhk.or.jp/rss/news/cat0.xml' },
  { country: 'JP',     source: 'Japan Times',     lang: 'EN', url: 'https://www.japantimes.co.jp/feed/' },
]

const DEFAULT_PRACTICE_LANG = 'es'
const DEFAULT_ARTICLE_LIMIT = 6

export default async function handler(req, res) {
  // Vercel cron sends header `x-vercel-cron: 1`. Allow that, plus a token-based
  // manual trigger for testing.
  const isCron = req.headers['x-vercel-cron'] === '1'
  const isManual = process.env.CRON_TOKEN && req.query.token === process.env.CRON_TOKEN
  if (!isCron && !isManual) return res.status(401).json({ error: 'Unauthorized' })

  let requestedLangs
  let articleLimit
  try {
    const requestedLangParam = req.query.lang || req.query.practiceLang
    requestedLangs = requestedLangParam ? parseRequestedLangs(requestedLangParam) : []
    articleLimit = requestedLangs.length
      ? parseArticleLimit(req.query.limit || req.query.maxArticles || req.query.batch)
      : 0
  } catch (e) {
    return res.status(e.status || 400).json({ error: e.message })
  }
  const force = ['1', 'true', 'yes'].includes(String(req.query.force || '').toLowerCase())
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
  const stats = {
    mode: requestedLangs.length ? 'fetch-and-translate' : 'fetch',
    langs: requestedLangs,
    articleLimit: Number.isFinite(articleLimit) ? articleLimit : 'all',
    feedsParsed: 0,
    articlesSeen: 0,
    articlesProcessed: 0,
    byLang: Object.fromEntries(
      requestedLangs.map((lang) => [lang, { articlesProcessed: 0, articlesSkipped: 0, errors: [] }]),
    ),
    errors: [],
  }

  // Fetch and parse all feeds.
  const grouped = {}
  await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const items = await fetchFeed(feed)
        ;(grouped[feed.country] ||= []).push(...items)
        stats.feedsParsed++
      } catch (e) {
        stats.errors.push({ stage: 'rss', feed: feed.url, error: e.message })
      }
    }),
  )

  // Top 5 per country, by pub date.
  for (const country of Object.keys(grouped)) {
    grouped[country].sort((a, b) => (b.pub_date || '').localeCompare(a.pub_date || ''))
    grouped[country] = grouped[country].slice(0, 5)
  }
  const all = Object.values(grouped)
    .flat()
    .sort((a, b) => (b.pub_date || '').localeCompare(a.pub_date || ''))
  stats.articlesSeen = all.length

  // Insert articles (idempotent: id = hash of source URL).
  if (all.length) {
    const { error } = await supabase
      .from('articles')
      .upsert(all, { onConflict: 'id', ignoreDuplicates: true })
    if (error) stats.errors.push({ stage: 'upsert articles', error: error.message })
  }

  // For each article missing translations in the requested practice language,
  // generate the content pack for that language.
  for (const lang of requestedLangs) {
    for (const article of all) {
      if (stats.byLang[lang].articlesProcessed >= articleLimit) break

      try {
        const { data: existing, error: existingError } = await supabase
          .from('article_translations')
          .select('level')
          .eq('article_id', article.id)
          .eq('lang', lang)
        if (existingError) throw existingError

        const existingLevels = new Set((existing || []).map((row) => row.level))
        const hasAllLevels = LEVELS.every((level) => existingLevels.has(level))
        if (!force && hasAllLevels) {
          stats.byLang[lang].articlesSkipped++
          continue
        }

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

        stats.byLang[lang].articlesProcessed++
        stats.articlesProcessed++
      } catch (e) {
        const error = { stage: 'generate', lang, article: article.id, error: e.message }
        stats.byLang[lang].errors.push(error)
        stats.errors.push(error)
      }
    }
  }

  const feedErrors = stats.errors.filter((error) => error.stage === 'rss' || error.stage === 'upsert articles')
  const statusLangs = requestedLangs.length ? requestedLangs : [DEFAULT_PRACTICE_LANG]
  const statusRows = statusLangs.map((lang) => {
    const langErrors = requestedLangs.length ? stats.byLang[lang].errors : []
    const errors = [...feedErrors, ...langErrors]
    return {
      id: 1,
      lang,
      last_run_at: new Date().toISOString(),
      articles_fetched: stats.articlesSeen,
      articles_processed: requestedLangs.length ? stats.byLang[lang].articlesProcessed : 0,
      errors: errors.length ? errors : null,
    }
  })
  await supabase.from('pipeline_status').upsert(statusRows, { onConflict: 'id,lang' })

  res.status(200).json(stats)
}

function parseRequestedLangs(raw) {
  const value = String(raw || '').toLowerCase().trim()
  if (value === 'all') return Object.keys(PRACTICE_LANGUAGES)

  const langs = [...new Set(value.split(',').map((x) => x.trim()).filter(Boolean))]
  const invalid = langs.filter((lang) => !PRACTICE_LANGUAGES[lang])
  if (invalid.length) {
    const allowed = Object.keys(PRACTICE_LANGUAGES).join('|')
    const err = new Error(`Unsupported lang "${invalid.join(',')}". Use ${allowed}, or all.`)
    err.status = 400
    throw err
  }
  return langs.length ? langs : [DEFAULT_PRACTICE_LANG]
}

function parseArticleLimit(raw) {
  const value = String(raw || '').toLowerCase().trim()
  if (!value) return DEFAULT_ARTICLE_LIMIT
  if (['all', 'none', 'unlimited'].includes(value)) return Number.POSITIVE_INFINITY

  const limit = Number.parseInt(value, 10)
  if (!Number.isFinite(limit) || limit < 1) {
    const err = new Error('Unsupported limit. Use a positive integer, or all.')
    err.status = 400
    throw err
  }
  return limit
}

// ─── RSS ─────────────────────────────────────────────────────────────

async function fetchFeed(feed) {
  const r = await fetch(feed.url, {
    headers: { 'User-Agent': 'NiveloBot/1.0 (+https://nivelo.app)' },
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const xml = await r.text()
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
  const parsed = parser.parse(xml)
  const rawItems =
    parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? []
  const items = Array.isArray(rawItems) ? rawItems : [rawItems]

  return items.slice(0, 5).map((it) => {
    const link = typeof it.link === 'string' ? it.link : it.link?.['@_href'] || it.link?.['#text'] || ''
    const title = typeof it.title === 'string' ? it.title : it.title?.['#text'] || ''
    const desc =
      it.description ?? it.summary ?? it['content:encoded'] ?? it.content?.['#text'] ?? ''
    const pub = it.pubDate || it.published || it.updated || null

    return {
      id: hashId(link || title),
      country: feed.country,
      source: feed.source,
      source_lang: feed.lang,
      source_url: link,
      pub_date: pub ? new Date(pub).toISOString() : null,
      raw_title: stripHtml(title),
      raw_description: stripHtml(desc).slice(0, 1000),
      image_seed: hashId(link || title),
      category: 'NOTICIAS',
    }
  }).filter((x) => x.source_url && x.raw_title)
}

function hashId(s) {
  // Stable, URL-safe slug from a string. Just enough entropy for a primary key.
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return 'a' + (h >>> 0).toString(36) + '-' + s.length.toString(36)
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}
