import { useEffect, useRef } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function TappableWord({ word, hebrew, isActive, onTap, onDismiss }) {
  const ref = useRef(null)
  const { hasWord, addWord, removeWord } = useApp()
  const saved = hasWord(word)

  useEffect(() => {
    if (!isActive) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [isActive, onDismiss])

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          isActive ? onDismiss() : onTap()
        }}
        className={
          'inline transition-colors ' +
          (isActive
            ? 'text-[#0A5C38] underline decoration-[#0A5C38] decoration-2 underline-offset-[5px]'
            : 'border-b border-dashed border-neutral-300 hover:border-[#0A5C38]/60')
        }
      >
        {word}
      </button>

      {isActive && (
        <span
          role="tooltip"
          className="anim-tooltip-in absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] z-40"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="block bg-neutral-900 text-white rounded-2xl px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] whitespace-nowrap">
            <span className="block text-[15px] font-hebrew text-right leading-tight" dir="rtl">
              {hebrew}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                saved ? removeWord(word) : addWord({ spanish: word, hebrew })
              }}
              className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white"
            >
              {saved ? (
                <>
                  <BookmarkCheck size={12} strokeWidth={2.5} /> Guardada
                </>
              ) : (
                <>
                  <Bookmark size={12} strokeWidth={2.5} /> Guardar
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
