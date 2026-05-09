import { createContext, useContext, useEffect, useState } from 'react'
import {
  COUNTRY_VALUES,
  LANG_BY_VALUE,
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

const normalizeSources = (v) => {
  if (Array.isArray(v)) {
    const valid = v.filter((s) => COUNTRY_VALUES.includes(s))
    return valid.length ? valid : COUNTRY_VALUES
  }
  return COUNTRY_VALUES
}
const normalizeLang = (v) => (LANG_BY_VALUE[v] ? v : 'en')
const normalizeUiLang = (v) => (LANG_BY_VALUE[v] ? v : detectBrowserLang())

export function AppProvider({ children }) {
  const [level, setLevel] = useState(() => read('nivelo:level', 'B1'))
  const [sources, setSources] = useState(() => normalizeSources(read('nivelo:sources', null)))
  const [targetLang, setTargetLang] = useState(() => normalizeLang(read('nivelo:targetLang', 'en')))
  const [uiLang, setUiLang] = useState(() => normalizeUiLang(read('nivelo:uiLang', null)))
  const [vocabulary, setVocabulary] = useState(() => read('nivelo:vocab', []))

  useEffect(() => { localStorage.setItem('nivelo:level', JSON.stringify(level)) }, [level])
  useEffect(() => { localStorage.setItem('nivelo:sources', JSON.stringify(sources)) }, [sources])
  useEffect(() => { localStorage.setItem('nivelo:targetLang', JSON.stringify(targetLang)) }, [targetLang])
  useEffect(() => { localStorage.setItem('nivelo:uiLang', JSON.stringify(uiLang)) }, [uiLang])
  useEffect(() => { localStorage.setItem('nivelo:vocab', JSON.stringify(vocabulary)) }, [vocabulary])

  // Reflect interface language + direction at the document root.
  useEffect(() => {
    const dir = LANG_BY_VALUE[uiLang]?.dir || 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = uiLang
  }, [uiLang])

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
