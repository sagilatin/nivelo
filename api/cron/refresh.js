// Daily pipeline. Triggered by Vercel cron at 07:00 UTC (≈ 08:00 CET / 09:00 CEST).
//
// Flow per run:
//   1. Fetch RSS for 7 countries × 1–3 sources each.
//   2. Take the 5 most recent items per country.
//   3. For each item not already in `articles`:
//      - Insert raw row.
//      - Ask Gemini for the full rewrite in the requested practice language
//        (A1–C2 headlines + bodies + tappable-word picks + UI-language
//        summary translations).
//      - Ask Gemini for a 5-question B1 quiz in the requested practice language.
//      - Write everything to Supabase.
//   4. Update pipeline_status with the run summary.
//
// All secrets are server-side env vars. Run manually via:
//   GET /api/cron/refresh?token=<CRON_TOKEN>&lang=fr
//   GET /api/cron/refresh?token=<CRON_TOKEN>&lang=all

import { createClient } from '@supabase/supabase-js'
import { XMLParser } from 'fast-xml-parser'

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

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const DEFAULT_PRACTICE_LANG = 'es'
const PRACTICE_LANGUAGES = {
  es: { name: 'Spanish' },
  fr: { name: 'French' },
  de: { name: 'German' },
  it: { name: 'Italian' },
  ja: { name: 'Japanese' },
  en: { name: 'English' },
}
const SUMMARY_TARGET_LANGUAGES = {
  en: 'English',
  he: 'Hebrew',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  ja: 'Japanese',
}

export default async function handler(req, res) {
  // Vercel cron sends header `x-vercel-cron: 1`. Allow that, plus a token-based
  // manual trigger for testing.
  const isCron = req.headers['x-vercel-cron'] === '1'
  const isManual = process.env.CRON_TOKEN && req.query.token === process.env.CRON_TOKEN
  if (!isCron && !isManual) return res.status(401).json({ error: 'Unauthorized' })

  let requestedLangs
  try {
    requestedLangs = parseRequestedLangs(req.query.lang || req.query.practiceLang)
  } catch (e) {
    return res.status(e.status || 400).json({ error: e.message })
  }
  const force = ['1', 'true', 'yes'].includes(String(req.query.force || '').toLowerCase())
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
  const stats = {
    langs: requestedLangs,
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
  const all = Object.values(grouped).flat()
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

        const generated = await rewriteWithGemini(article, lang)
        const quiz = await generateQuiz(article, generated.B1, lang)

        const transRows = LEVELS.map((level) => ({
          article_id: article.id,
          lang,
          level,
          headline: generated[level].headline,
          summary: generated.summary,
          body: generated[level].body,
        }))
        const sumRows = Object.entries(generated.summaryTranslations || {}).map(([targetLang, text]) => ({
          article_id: article.id,
          lang,
          target_lang: targetLang,
          text,
        }))

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
  const statusRows = requestedLangs.map((lang) => {
    const errors = [...feedErrors, ...stats.byLang[lang].errors]
    return {
      id: 1,
      lang,
      last_run_at: new Date().toISOString(),
      articles_fetched: stats.articlesSeen,
      articles_processed: stats.byLang[lang].articlesProcessed,
      errors: errors.length ? errors : null,
    }
  })
  await supabase.from('pipeline_status').upsert(statusRows, { onConflict: 'id,lang' })

  res.status(200).json(stats)
}

function parseRequestedLangs(raw) {
  const value = String(raw || DEFAULT_PRACTICE_LANG).toLowerCase().trim()
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

// ─── Gemini ──────────────────────────────────────────────────────────

async function rewriteWithGemini(article, practiceLang) {
  const practice = PRACTICE_LANGUAGES[practiceLang]
  const targetList = Object.entries(SUMMARY_TARGET_LANGUAGES)
    .map(([code, name]) => `"${code}" (${name})`)
    .join(', ')
  const prompt = `You are rewriting a news item as ${practice.name} learning material for the app Nivelo.

Original article (in ${article.source_lang}):
TITLE: ${article.raw_title}
DESCRIPTION: ${article.raw_description}

Produce a JSON response with the following fields, all in ${practice.name} where indicated:

- "summary": ONE ${practice.name} sentence (≈ 12 words) that summarises the story for a news card.
- "summaryTranslations": object with the ${practice.name} summary translated into each of: ${targetList}.
- For each of "A1","A2","B1","B2","C1","C2":
    "headline": ${practice.name} headline tuned to the level. Simpler/shorter for A1, longer & more sophisticated for C2.
    "body": ${practice.name} body text tuned to the level:
        A1: 4-5 short present-tense sentences with very basic vocabulary.
        A2: 5-6 simple sentences with simple past.
        B1: one solid paragraph (4-5 sentences), mixed tenses.
        B2: 1-2 paragraphs, richer vocabulary, more complex sentences.
        C1: 2 paragraphs, sophisticated vocabulary.
        C2: 2-3 paragraphs, literary register.
    "words": array of 2-4 ${practice.name} words or short terms from the body that are good
            vocabulary candidates for word-tap translation (no punctuation).

Output STRICT JSON only, no markdown fences, no explanation.`

  const data = await callGemini(prompt, true)
  const result = { summary: data.summary, summaryTranslations: data.summaryTranslations || {} }
  for (const level of LEVELS) {
    const lvl = data[level] || {}
    const bodyText = String(lvl.body || '').trim()
    const words = Array.isArray(lvl.words) ? lvl.words : []
    result[level] = {
      headline: String(lvl.headline || '').trim(),
      body: bodyToSegments(bodyText, words),
    }
  }
  return result
}

async function generateQuiz(article, b1, practiceLang) {
  const practice = PRACTICE_LANGUAGES[practiceLang]
  const bodyText = b1.body.map((p) => p.map((s) => s.text).join('')).join('\n\n')
  const prompt = `Build a 5-question ${practice.name} quiz on this article. Mix Vocabulario, Comprensión, Gramática.
Return STRICT JSON ARRAY only:
[{"type":"Vocabulario","question":"...","options":["a","b","c","d"],"correctIndex":0}, ...]
Use only these exact "type" values: "Vocabulario", "Comprensión", "Gramática".
Write question text and answer options in ${practice.name}.

ARTICLE HEADLINE: ${b1.headline}
ARTICLE BODY:
${bodyText}`
  const data = await callGemini(prompt, true)
  return Array.isArray(data) ? data : []
}

async function callGemini(prompt, json) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: json
        ? { responseMimeType: 'application/json', temperature: 0.4 }
        : { temperature: 0.4 },
    }),
  })
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${await r.text().catch(() => '')}`)
  const data = await r.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!json) return text
  try {
    return JSON.parse(text)
  } catch (e) {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`)
  }
}

// ─── Body → segments ────────────────────────────────────────────────

function bodyToSegments(text, words) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  return paragraphs.map((p) => splitWithWords(p, words))
}

function splitWithWords(text, words) {
  if (!words?.length) return [{ text }]
  const escaped = words
    .filter((w) => typeof w === 'string' && w)
    .map((w) => w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
  if (!escaped.length) return [{ text }]
  const re = new RegExp(`\\b(${escaped.join('|')})\\b`, 'i')
  const out = []
  let remaining = text
  while (remaining.length) {
    const m = remaining.match(re)
    if (!m) {
      out.push({ text: remaining })
      break
    }
    if (m.index > 0) out.push({ text: remaining.slice(0, m.index) })
    out.push({ text: m[0], t: true })
    remaining = remaining.slice(m.index + m[0].length)
  }
  return out
}
