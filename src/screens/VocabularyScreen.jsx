import { useState } from 'react'
import TabBar from '../components/TabBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import { Trash2 } from 'lucide-react'
import { getTranslation } from '../data/glossary.js'

function FlashCard({ entry, currentTargetLang }) {
  const [flipped, setFlipped] = useState(false)
  // Prefer the translation saved at the time of saving; fall back to the
  // current target language so freshly-changed languages still work.
  const lang = entry.lang || currentTargetLang
  const translation = entry.translation || getTranslation(entry.spanish, lang) || '—'

  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="w-full bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-5 text-left active:scale-[0.99] transition flex items-center justify-between gap-4 min-h-[80px]"
    >
      {flipped ? (
        <span className="text-[20px] font-medium text-neutral-900">{translation}</span>
      ) : (
        <span className="text-[18px] font-semibold text-neutral-900 tracking-[-0.01em]">
          {entry.spanish}
        </span>
      )}
      <span className="text-[10.5px] tracking-wide font-bold text-neutral-400 uppercase shrink-0 bg-neutral-100 px-2 py-0.5 rounded">
        {flipped ? lang.toUpperCase() : 'ES'}
      </span>
    </button>
  )
}

export default function VocabularyScreen() {
  const { vocabulary, clearVocabulary, targetLang } = useApp()
  const t = useT()
  const words = vocabulary.filter((w) => !w.spanish.startsWith('__article:'))

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-20 bg-[#FAFAF8]/85 backdrop-blur-md px-5 pt-4 pb-3 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-neutral-900">
            {t.myWords}
          </h1>
          <p className="text-[13px] text-neutral-500 mt-0.5">
            {words.length === 0
              ? t.yourListEmpty
              : `${words.length} · ${t.myWords}`}
          </p>
        </div>
        {words.length > 0 && (
          <button
            onClick={() => { if (confirm(t.confirmDelete)) clearVocabulary() }}
            className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg shrink-0"
          >
            <Trash2 size={14} strokeWidth={2.2} /> {t.deleteAll}
          </button>
        )}
      </header>

      <div className="px-5 mt-2">
        <p className="text-[12px] text-neutral-400 mb-3">{t.flipHint}</p>
      </div>

      <div className="px-5 space-y-2.5">
        {words.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-[15px] font-semibold text-neutral-700">{t.yourListEmpty}</p>
            <p className="text-[13px] text-neutral-500 mt-1.5 leading-snug">{t.yourListHint}</p>
          </div>
        ) : (
          words.map((w) => (
            <FlashCard key={w.spanish} entry={w} currentTargetLang={targetLang} />
          ))
        )}
      </div>

      <TabBar />
    </div>
  )
}
