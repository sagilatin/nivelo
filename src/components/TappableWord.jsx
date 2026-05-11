import { useEffect, useMemo, useRef, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { getTranslation } from '../data/glossary.js'
import { useT } from '../i18n/useT.js'

const isHoverDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export default function TappableWord({
  word,
  sourceLang = 'es',
  isActive,
  onShow,
  onScheduleHide,
  onCancelHide,
  onToggleClick,
  onDismissNow,
}) {
  const wrapperRef = useRef(null)
  const hoverable = useMemo(isHoverDevice, [])
  const t = useT()

  // Tooltip translates the tapped word INTO the user's interface language
  // (per spec). For source lang we use whatever the article body is written
  // in (defaults to Spanish for the seed data).
  const { hasWord, addWord, removeWord, uiLang } = useApp()
  const localTranslation = getTranslation(word, uiLang)
  const [remoteTranslation, setRemoteTranslation] = useState('')
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const translation = localTranslation || remoteTranslation
  const saved = hasWord(word)

  // When a tooltip opens for a word the local glossary doesn't know, ask the
  // /api/translate endpoint (DeepL/Gemini behind the scenes, cached in
  // Supabase). Stays a noop if the local glossary already has the word or if
  // /api/translate isn't deployed yet (returns blank, tooltip shows "—").
  useEffect(() => {
    if (!isActive || localTranslation || remoteTranslation) return
    if (sourceLang === uiLang) return
    let cancelled = false
    setLoadingTranslation(true)
    fetch(
      `/api/translate?word=${encodeURIComponent(word)}` +
        `&lang=${encodeURIComponent(uiLang)}` +
        `&source=${encodeURIComponent(sourceLang)}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return
        if (data?.translation) setRemoteTranslation(data.translation)
        setLoadingTranslation(false)
      })
      .catch(() => {
        if (!cancelled) setLoadingTranslation(false)
      })
    return () => { cancelled = true }
  }, [isActive, word, uiLang, sourceLang, localTranslation, remoteTranslation])

  useEffect(() => {
    if (!isActive) return
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) onDismissNow()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [isActive, onDismissNow])

  const hoverProps = hoverable
    ? {
        onMouseEnter: () => { onCancelHide(); onShow() },
        onMouseLeave: () => onScheduleHide(),
      }
    : {}

  return (
    <span ref={wrapperRef} className="relative inline-block" {...hoverProps}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleClick()
        }}
        className={
          'inline transition-colors ' +
          (isActive
            ? 'text-[#0A5C38] underline decoration-[#0A5C38] decoration-2 underline-offset-[5px]'
            : 'border-b border-dashed border-neutral-300 hover:border-[#0A5C38]/60 cursor-pointer')
        }
      >
        {word}
      </button>

      {isActive && (
        <span
          role="tooltip"
          className="anim-tooltip-in absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] z-[9999]"
          {...hoverProps}
        >
          <span className="block bg-neutral-900 text-white rounded-2xl px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] whitespace-nowrap">
            <span className="block text-[14px] leading-tight font-medium">
              <span className="text-neutral-300">{word}</span>
              <span className="text-neutral-500 mx-1.5">=</span>
              <span>{translation || (loadingTranslation ? '…' : '—')}</span>
              <span className="ms-2 inline-block text-[10px] font-bold tracking-wide bg-white/15 px-1.5 py-0.5 rounded">
                {uiLang.toUpperCase()}
              </span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                saved
                  ? removeWord(word)
                  : addWord({ spanish: word, sourceLang, translation, lang: uiLang })
              }}
              className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white"
            >
              {saved ? (
                <>
                  <BookmarkCheck size={12} strokeWidth={2.5} /> {t.saved}
                </>
              ) : (
                <>
                  <Bookmark size={12} strokeWidth={2.5} /> {t.save}
                </>
              )}
            </button>
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 top-full">
            <span className="block w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-900" />
          </span>
        </span>
      )}
    </span>
  )
}
