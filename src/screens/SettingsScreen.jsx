import { useNavigate } from 'react-router-dom'
import TabBar from '../components/TabBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import { APP_TAGLINE } from '../i18n/strings.js'
import { ChevronRight, RotateCcw } from 'lucide-react'
import {
  LEVELS,
  LANGUAGES,
  PRACTICE_LANGUAGES,
  LANG_BY_VALUE,
  PRACTICE_LANG_BY_VALUE,
} from '../data/constants.js'

function Row({ label, value, onClick, last }) {
  return (
    <button
      onClick={onClick}
      className={
        'w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-neutral-50 ' +
        (last ? '' : 'border-b border-neutral-100')
      }
    >
      <span className="text-[15px] text-neutral-800">{label}</span>
      <span className="flex items-center gap-1 text-[14px] text-neutral-500">
        {value}
        <ChevronRight size={16} className="text-neutral-300 rtl:rotate-180" strokeWidth={2.2} />
      </span>
    </button>
  )
}

export default function SettingsScreen() {
  const t = useT()
  const navigate = useNavigate()
  const {
    level, setLevel,
    targetLang, setTargetLang,
    uiLang, setUiLang,
    resetPreferences,
  } = useApp()

  const cycle = (current, list) => list[(list.indexOf(current) + 1) % list.length]
  const uiLangValues = LANGUAGES.map((l) => l.value)
  const practiceLangValues = PRACTICE_LANGUAGES.map((l) => l.value)

  const langOpt = PRACTICE_LANG_BY_VALUE[targetLang] || PRACTICE_LANGUAGES[0]
  const uiOpt = LANG_BY_VALUE[uiLang] || LANGUAGES[0]

  const handleReset = () => {
    if (!confirm(t.confirmReset)) return
    resetPreferences()
    navigate('/welcome', { replace: true })
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-4 pb-5">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-neutral-900">
          {t.settings}
        </h1>
        <p className="text-[13px] text-neutral-500 mt-0.5" dir="ltr">{APP_TAGLINE}</p>
      </header>

      <section className="px-4">
        <h2 className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase px-2 mb-2">
          {t.learning}
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <Row label={t.level} value={level} onClick={() => setLevel(cycle(level, LEVELS))} />
          <Row
            label={t.translation}
            value={`${langOpt.flag} ${langOpt.label}`}
            onClick={() => setTargetLang(cycle(targetLang, practiceLangValues))}
          />
          <Row
            label={t.interfaceLang}
            value={`${uiOpt.flag} ${uiOpt.label}`}
            onClick={() => setUiLang(cycle(uiLang, uiLangValues))}
            last
          />
        </div>
      </section>

      <section className="px-4 mt-6">
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-neutral-50"
          >
            <span className="flex items-center gap-2 text-[15px] text-red-600 font-medium">
              <RotateCcw size={16} strokeWidth={2.2} />
              {t.resetPreferences}
            </span>
            <ChevronRight size={16} className="text-neutral-300 rtl:rotate-180" strokeWidth={2.2} />
          </button>
        </div>
      </section>

      <section className="px-4 mt-6">
        <h2 className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase px-2 mb-2">
          {t.about}
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <Row label={t.version} value="0.2" last />
        </div>
        <p className="text-[12px] text-neutral-400 text-center mt-6 leading-relaxed" dir="ltr">
          Nivelo · {APP_TAGLINE}
        </p>
      </section>

      <TabBar />
    </div>
  )
}
