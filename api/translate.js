// /api/translate?word=batería&lang=de
//
// Single source of truth for word-tap translations.
//   1. Look up in Supabase word_translations cache.
//   2. Miss → call DeepL (preferred, where supported).
//   3. DeepL doesn't support Hebrew → call Gemini for he.
//   4. Cache the result back to Supabase, return.
//
// Server-only secrets (DeepL key, Supabase service role) live in Vercel env vars
// and never touch the browser.

import { createClient } from '@supabase/supabase-js'

// DeepL supports these among our 6 interface languages. Hebrew is missing.
const DEEPL_LANG_MAP = { en: 'EN-US', de: 'DE', fr: 'FR', it: 'IT', ja: 'JA', es: 'ES' }
const VALID_TARGETS = new Set(['en', 'he', 'de', 'fr', 'it', 'ja'])
const VALID_SOURCES = new Set(['es', 'fr', 'de', 'it', 'ja', 'en'])
const DEEPL_SOURCE_MAP = { es: 'ES', fr: 'FR', de: 'DE', it: 'IT', ja: 'JA', en: 'EN' }
const LANG_NAME = { es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', ja: 'Japanese', en: 'English', he: 'Hebrew' }

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')

  const word = String(req.query.word || '').trim()
  const lang = String(req.query.lang || '').toLowerCase()
  const source = String(req.query.source || 'es').toLowerCase()

  if (!word || !VALID_TARGETS.has(lang) || !VALID_SOURCES.has(source)) {
    return res.status(400).json({
      error: 'Provide ?word=<word>&lang=<en|he|de|fr|it|ja>&source=<es|fr|de|it|ja|en>',
    })
  }
  if (source === lang) {
    return res.status(200).json({ word, lang, translation: word, source: 'identity' })
  }

  // Read the URL from either env name — Vercel deploys typically only set
  // VITE_SUPABASE_URL because the same value is used client-side.
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  // 1) cache lookup — keyed on (source word, source lang, target lang)
  const cached = await supabase
    .from('word_translations')
    .select('translation')
    .eq('word', word.toLowerCase())
    .eq('source_lang', source)
    .eq('lang', lang)
    .maybeSingle()
  if (cached.data) {
    return res.status(200).json({ word, lang, translation: cached.data.translation, source: 'cache' })
  }

  // 2/3) translate
  let translation = ''
  let provider = ''
  try {
    if (DEEPL_LANG_MAP[lang] && DEEPL_SOURCE_MAP[source]) {
      translation = await deepLTranslate(word, source, lang)
      provider = 'deepl'
    } else {
      translation = await geminiTranslateOne(word, source, lang)
      provider = 'gemini'
    }
  } catch (e) {
    return res.status(502).json({ error: 'translation provider failed', detail: e.message })
  }

  if (!translation) {
    return res.status(404).json({ error: 'no translation' })
  }

  // 4) cache and return
  await supabase
    .from('word_translations')
    .upsert({
      word: word.toLowerCase(),
      source_lang: source,
      lang,
      translation,
      provider,
    })

  return res.status(200).json({ word, lang, translation, source: provider })
}

async function deepLTranslate(text, source, lang) {
  const r = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text,
      source_lang: DEEPL_SOURCE_MAP[source],
      target_lang: DEEPL_LANG_MAP[lang],
    }),
  })
  if (!r.ok) throw new Error(`DeepL ${r.status}`)
  const data = await r.json()
  return data.translations?.[0]?.text || ''
}

async function geminiTranslateOne(text, source, lang) {
  const srcName = LANG_NAME[source] || source
  const tgtName = LANG_NAME[lang] || lang
  const prompt = `Translate the ${srcName} word "${text}" into ${tgtName}. Return ONLY the single translated word, no quotes or commentary.`
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  )
  if (!r.ok) throw new Error(`Gemini ${r.status}`)
  const data = await r.json()
  return (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim()
}
