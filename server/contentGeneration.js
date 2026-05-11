export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const PRACTICE_LANGUAGES = {
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

const DEFAULT_GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
]

const GEMINI_MODELS = (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODELS.join(','))
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean)

export function isPracticeLanguage(lang) {
  return Boolean(PRACTICE_LANGUAGES[lang])
}

export function buildTranslationRows(articleId, lang, generated) {
  return LEVELS.map((level) => ({
    article_id: articleId,
    lang,
    level,
    headline: generated[level].headline,
    summary: generated.summary,
    body: generated[level].body,
  }))
}

export function buildSummaryRows(articleId, lang, generated) {
  return Object.entries(generated.summaryTranslations || {}).map(([targetLang, text]) => ({
    article_id: articleId,
    lang,
    target_lang: targetLang,
    text,
  }))
}

export async function generateArticleContent(article, practiceLang) {
  const practice = PRACTICE_LANGUAGES[practiceLang]
  const targetList = Object.entries(SUMMARY_TARGET_LANGUAGES)
    .map(([code, name]) => `"${code}" (${name})`)
    .join(', ')
  const prompt = `You are rewriting a news item as ${practice.name} learning material for the app Nivelo.

Original article (in ${article.source_lang}):
TITLE: ${article.raw_title}
DESCRIPTION: ${article.raw_description}

Produce a JSON response with the following fields, all in ${practice.name} where indicated:

- "summary": ONE ${practice.name} sentence (approximately 12 words) that summarises the story for a news card.
- "summaryTranslations": object with the ${practice.name} summary translated into each of: ${targetList}.
- For each of "A1","A2","B1","B2","C1","C2":
    "headline": ${practice.name} headline tuned to the level. Simpler/shorter for A1, longer and more sophisticated for C2.
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

export async function generateQuiz(article, b1, practiceLang) {
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
  try {
    const data = await callGemini(prompt, true)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn(`Quiz generation failed for ${article.id}: ${e.message}`)
    return []
  }
}

async function callGemini(prompt, json) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: json
      ? { responseMimeType: 'application/json', temperature: 0.4 }
      : { temperature: 0.4 },
  })
  const errors = []

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      errors.push(`${model} ${r.status}: ${detail.slice(0, 500)}`)
      if (![429, 500, 502, 503, 504].includes(r.status)) break
      continue
    }

    const data = await r.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!json) return text
    try {
      return JSON.parse(text)
    } catch (e) {
      throw new Error(`Gemini returned non-JSON from ${model}: ${text.slice(0, 200)}`)
    }
  }

  throw new Error(`Gemini failed across models: ${errors.join(' | ')}`)
}

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
