import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [level, setLevel] = useState(() => read('nivelo:level', 'B1'))
  const [source, setSource] = useState(() => read('nivelo:source', 'Todas las fuentes'))
  const [vocabulary, setVocabulary] = useState(() => read('nivelo:vocab', []))

  useEffect(() => { localStorage.setItem('nivelo:level', JSON.stringify(level)) }, [level])
  useEffect(() => { localStorage.setItem('nivelo:source', JSON.stringify(source)) }, [source])
  useEffect(() => { localStorage.setItem('nivelo:vocab', JSON.stringify(vocabulary)) }, [vocabulary])

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
        source,
        setSource,
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
