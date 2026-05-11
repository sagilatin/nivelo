import { createContext, useContext, useEffect, useState } from 'react'
import {
  COUNTRY_VALUES,
  LANG_BY_VALUE,
  PRACTICE_LANG_BY_VALUE,
  DEFAULT_PRACTICE_LANG,
  detectBrowserLang,
} from '../data/constants.js'

const AppContext = createContext(null)

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

// Read initial values from URL params (so shareable links pre-fill settings)
// before falling back to localStorage. Runs once on first render.
const readFromUrl = () => {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const out = {}
  if (p.has('level')) out.level = p.get('level')
  if (p.has('lang')) out.targetLang = p.get('lang')
  if (p.has('ui')) out.uiLang = p.get('ui')
  if (p.has('sources')) out.sources = p.get('sources').split(',').filter(Boolean)
  return out
}

const normalizeSources = (v) => {
  if (Array.isArray(v)) {
    const valid = v.filter((s) => COUNTRY_VALUES.includes(s))
    return valid.length ? valid : COUNTRY_VALUES
  }
  return COUNTRY_VALUES
}
const normalizeLang = (v) => (PRACTICE_LANG_BY_VALUE[v] ? v : DEFAULT_PRACTICE_LANG)
const normalizeUiLang = (v) => (LANG_BY_VALUE[v] ? v : detectBrowserLang())
const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const normalizeLevel = (v) => (VALID_LEVELS.includes(v) ? v : 'B1')

export function AppProvider({ children }) {
  const urlInit = typeof window !== 'undefined' ? readFromUrl() : {}

  const [level, setLevel] = useState(() =>
    normalizeLevel(urlInit.level ?? read('nivelo:level', 'B1')),
  )
  const [sources, setSources] = useState(() =>
    normalizeSources(urlInit.sources ?? read('nivelo:sources', null)),
  )
  const [targetLang, setTargetLang] = useState(() =>
    normalizeLang(urlInit.targetLang ?? read('nivelo:targetLang', DEFAULT_PRACTICE_LANG)),
  )
  const [uiLang, setUiLang] = useState(() =>
    normalizeUiLang(urlInit.uiLang ?? read('nivelo:uiLang', null)),
  )
  const [onboarded, setOnboarded] = useState(() => read('nivelo:onboarded', false))
  const [vocabulary, setVocabulary] = useState(() => read('nivelo:vocab', []))

  useEffect(() => { localStorage.setItem('nivelo:level', JSON.stringify(level)) }, [level])
  useEffect(() => { localStorage.setItem('nivelo:sources', JSON.stringify(sources)) }, [sources])
  useEffect(() => { localStorage.setItem('nivelo:targetLang', JSON.stringify(targetLang)) }, [targetLang])
  useEffect(() => { localStorage.setItem('nivelo:uiLang', JSON.stringify(uiLang)) }, [uiLang])
  useEffect(() => { localStorage.setItem('nivelo:onboarded', JSON.stringify(onboarded)) }, [onboarded])
  useEffect(() => { localStorage.setItem('nivelo:vocab', JSON.stringify(vocabulary)) }, [vocabulary])

  // Reflect interface language + direction at the document root.
  useEffect(() => {
    const dir = LANG_BY_VALUE[uiLang]?.dir || 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = uiLang
  }, [uiLang])

  // Mirror current settings to URL params so links are shareable. Uses
  // replaceState so the back button isn't polluted on every change.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    p.set('level', level)
    p.set('lang', targetLang)
    p.set('ui', uiLang)
    const allOn = COUNTRY_VALUES.every((v) => sources.includes(v))
    if (allOn) p.delete('sources')
    else p.set('sources', sources.join(','))
    const next = `${window.location.pathname}?${p.toString()}${window.location.hash}`
    window.history.replaceState(null, '', next)
  }, [level, sources, targetLang, uiLang])

  const addWord = (word) => {
    setVocabulary((prev) =>
      prev.find((w) => w.spanish === word.spanish)
        ? prev
        : [{ ...word, savedAt: Date.now() }, ...prev],
    )
  }
  const removeWord = (spanish) =>
    setVocabulary((prev) => prev.filter((w) => w.spanish !== spanish))
  const clearVocabulary = () => setVocabulary([])
  const hasWord = (spanish) => vocabulary.some((w) => w.spanish === spanish)

  // Wipe everything onboarding-related. Vocabulary is kept on purpose — users
  // would lose their saved words otherwise.
  const resetPreferences = () => {
    setOnboarded(false)
    setLevel('B1')
    setSources(COUNTRY_VALUES)
    setTargetLang(DEFAULT_PRACTICE_LANG)
    setUiLang(detectBrowserLang())
  }

  return (
    <AppContext.Provider
      value={{
        level,
        setLevel,
        sources,
        setSources,
        targetLang,
        setTargetLang,
        uiLang,
        setUiLang,
        onboarded,
        setOnboarded,
        resetPreferences,
        vocabulary,
        addWord,
        removeWord,
        clearVocabulary,
        hasWord,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
