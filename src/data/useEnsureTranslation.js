import { useEffect, useMemo, useState } from 'react'
import { hasSupabase } from '../lib/supabase.js'
import { mergeArticleTranslation } from './useArticles.js'

const inFlight = new Map()

export function useEnsureTranslation(article, practiceLang, enabled) {
  const [payload, setPayload] = useState(null)
  const [state, setState] = useState({ loading: false, error: null })

  useEffect(() => {
    setPayload(null)
    if (!enabled || !article?.id || !practiceLang || !hasSupabase) {
      setState({ loading: false, error: null })
      return
    }
    if (article.byLang?.[practiceLang]?.byLevel && Object.keys(article.byLang[practiceLang].byLevel).length) {
      setState({ loading: false, error: null })
      return
    }

    let cancelled = false
    const key = `${article.id}:${practiceLang}`
    setState({ loading: true, error: null })

    const request = inFlight.get(key) || fetch(
      `/api/content/ensure?articleId=${encodeURIComponent(article.id)}&lang=${encodeURIComponent(practiceLang)}`,
    ).then(async (res) => {
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || data.error || `HTTP ${res.status}`)
      return data
    }).finally(() => {
      inFlight.delete(key)
    })

    inFlight.set(key, request)
    request
      .then((data) => {
        if (!cancelled) {
          setPayload(data)
          setState({ loading: false, error: null })
        }
      })
      .catch((e) => {
        if (!cancelled) setState({ loading: false, error: e.message })
      })

    return () => {
      cancelled = true
    }
  }, [article?.id, article?.byLang, practiceLang, enabled])

  const mergedArticle = useMemo(
    () => (payload ? mergeArticleTranslation(article, payload) : article),
    [article, payload],
  )

  return { article: mergedArticle, ...state }
}
