import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Loader2, ArrowRight } from 'lucide-react'
import Dropdown from '../components/Dropdown.jsx'
import MultiSelectDropdown from '../components/MultiSelectDropdown.jsx'
import Logo from '../components/Logo.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import { APP_TAGLINE } from '../i18n/strings.js'
import {
  LEVELS,
  SOURCES,
  LANGUAGES,
  PRACTICE_LANGUAGES,
  PRACTICE_LANG_BY_VALUE,
  SOURCE_BY_VALUE,
  LANG_BY_VALUE,
  COUNTRY_VALUES,
} from '../data/constants.js'

// First-time onboarding. Three compact dropdown selectors, English-only
// tagline. Submitting flips the `onboarded` flag and routes to /.
export default function WelcomeScreen() {
  const navigate = useNavigate()
  const t = useT()
  const {
    level, setLevel,
    sources, setSources,
    targetLang, setTargetLang,
    uiLang, setUiLang,
    setOnboarded,
  } = useApp()

  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    setOnboarded(true)
    navigate('/', { replace: true })
  }

  const uiOpt = LANG_BY_VALUE[uiLang] || LANG_BY_VALUE.en
  const practiceOpt = PRACTICE_LANG_BY_VALUE[targetLang] || PRACTICE_LANGUAGES[0]

  // Level dropdown options carry the description as their label so the open
  // menu shows "A1 — Beginner — simple words…", but the closed trigger shows
  // just the level code (rendered separately below).
  const levelOptions = LEVELS.map((lvl) => ({
    value: lvl,
    label: `${lvl} · ${t[`levelDesc${lvl}`] || ''}`,
  }))

  // Sources pill content
  const allSelected = COUNTRY_VALUES.every((v) => sources.includes(v))
  const sourcesTrigger = (
    <span className="flex items-center gap-1 text-[14px] font-medium text-neutral-800">
      {allSelected ? (
        <>
          <span className="text-[16px] leading-none">🌍</span>
          <span>{t.allSources}</span>
        </>
      ) : sources.length === 0 ? (
        <span>—</span>
      ) : (
        <>
          {sources.slice(0, 3).map((s) => (
            <span key={s} className="text-[16px] leading-none">
              {SOURCE_BY_VALUE[s]?.flag}
            </span>
          ))}
          {sources.length > 3 && <span className="text-neutral-500 text-[12px]">+{sources.length - 3}</span>}
        </>
      )}
    </span>
  )

  const practiceTrigger = (
    <span className="flex items-center gap-1.5 text-[14px] font-medium text-neutral-800">
      <span className="text-[16px] leading-none">{practiceOpt.flag}</span>
      <span>{practiceOpt.label}</span>
    </span>
  )

  const levelTrigger = (
    <span className="text-[14px] font-bold tracking-wide text-[#0A5C38]">{level}</span>
  )

  return (
    <div className="min-h-screen pb-12 px-5 pt-4 flex flex-col">
      <header className="flex items-center justify-end">
        <Dropdown
          ariaLabel={t.interfaceLang}
          triggerContent={
            <span className="flex items-center gap-1.5">
              <Globe size={16} strokeWidth={2.2} className="text-neutral-700" />
              <span className="text-[15px] leading-none">{uiOpt.flag}</span>
            </span>
          }
          options={LANGUAGES}
          selected={uiLang}
          onSelect={setUiLang}
          align="right"
        />
      </header>

      <div className="flex flex-col items-center text-center pt-10 pb-10">
        <Logo size={56} />
        <p className="mt-4 text-[15px] text-neutral-500 max-w-[300px] leading-snug" dir="ltr">
          {APP_TAGLINE}
        </p>
      </div>

      <div className="space-y-3">
        <ControlRow label={t.selectNews}>
          <MultiSelectDropdown
            ariaLabel={t.selectNews}
            triggerContent={sourcesTrigger}
            options={SOURCES}
            selected={sources}
            onChange={setSources}
            align="left"
          />
        </ControlRow>

        <ControlRow label={t.selectLanguage}>
          <Dropdown
            ariaLabel={t.selectLanguage}
            triggerContent={practiceTrigger}
            options={PRACTICE_LANGUAGES}
            selected={targetLang}
            onSelect={setTargetLang}
            align="left"
          />
        </ControlRow>

        <ControlRow label={t.selectYourLevel} sub={t[`levelDesc${level}`]}>
          <Dropdown
            ariaLabel={t.selectYourLevel}
            triggerContent={levelTrigger}
            options={levelOptions}
            selected={level}
            onSelect={setLevel}
            align="left"
          />
        </ControlRow>
      </div>

      <div className="mt-auto pt-10">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || sources.length === 0}
          className={
            'w-full py-4 rounded-2xl text-[15px] font-semibold transition active:scale-[0.99] flex items-center justify-center gap-2 ' +
            (sources.length === 0
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-[#0A5C38] text-white shadow-[0_4px_14px_rgba(10,92,56,0.25)] hover:bg-[#084a2d]')
          }
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t.preparingFeed}
            </>
          ) : (
            <>
              {t.startReading}
              <ArrowRight size={16} strokeWidth={2.6} className="rtl:rotate-180" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Label on the left, compact dropdown pill on the right. Optional `sub`
// renders a small description beneath the label (used for the level row to
// show what the selected CEFR level means without having to open the menu).
function ControlRow({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-neutral-800">{label}</div>
        {sub && <div className="text-[11.5px] text-neutral-500 mt-0.5 truncate">{sub}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
