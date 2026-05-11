import { Globe } from 'lucide-react'
import Dropdown from './Dropdown.jsx'
import MultiSelectDropdown from './MultiSelectDropdown.jsx'
import Logo from './Logo.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import {
  LEVELS,
  SOURCES,
  LANGUAGES,
  PRACTICE_LANGUAGES,
  COUNTRY_VALUES,
  SOURCE_BY_VALUE,
  LANG_BY_VALUE,
  PRACTICE_LANG_BY_VALUE,
} from '../data/constants.js'

const LEVEL_OPTIONS = LEVELS.map((v) => ({ value: v, label: v }))

export default function TopBar() {
  const t = useT()
  const {
    level, setLevel,
    sources, setSources,
    targetLang, setTargetLang,
    uiLang, setUiLang,
  } = useApp()

  const allSelected = COUNTRY_VALUES.every((v) => sources.includes(v))
  const sourceTrigger = allSelected ? (
    <span className="flex items-center gap-1">
      <span className="text-[15px] leading-none">🌍</span>
      <span className="text-[12px]">{t.allSources}</span>
    </span>
  ) : sources.length === 0 ? (
    <span className="text-[15px] leading-none">🚫</span>
  ) : (
    <span className="text-[14px] leading-none truncate">
      {sources
        .slice(0, 4)
        .map((s) => SOURCE_BY_VALUE[s]?.flag)
        .join(' ')}
      {sources.length > 4 ? ' …' : ''}
    </span>
  )

  const langOpt = PRACTICE_LANG_BY_VALUE[targetLang] || PRACTICE_LANGUAGES[0]
  const langTrigger = (
    <span className="flex items-center gap-1 text-[15px] leading-none">
      <span>{langOpt.flag}</span>
    </span>
  )

  const uiLangOpt = LANG_BY_VALUE[uiLang] || LANG_BY_VALUE.en
  const uiTrigger = (
    <span className="flex items-center gap-1">
      <Globe size={14} strokeWidth={2.2} className="text-neutral-700" />
      <span className="text-[15px] leading-none">{uiLangOpt.flag}</span>
    </span>
  )

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF8]/85 backdrop-blur-md px-3 pt-4 pb-3 flex items-center gap-1.5">
      <div className="mr-auto pl-1.5">
        <Logo size={22} />
      </div>

      <Dropdown
        ariaLabel={t.level}
        triggerContent={level}
        options={LEVEL_OPTIONS}
        selected={level}
        onSelect={setLevel}
        align="right"
      />

      <MultiSelectDropdown
        ariaLabel={t.sources}
        triggerContent={sourceTrigger}
        options={SOURCES}
        selected={sources}
        onChange={setSources}
        align="right"
      />

      <Dropdown
        ariaLabel={t.translation}
        triggerContent={langTrigger}
        options={PRACTICE_LANGUAGES}
        selected={targetLang}
        onSelect={setTargetLang}
        align="right"
      />

      <Dropdown
        ariaLabel={t.interfaceLang}
        triggerContent={uiTrigger}
        options={LANGUAGES}
        selected={uiLang}
        onSelect={setUiLang}
        align="right"
      />
    </header>
  )
}
