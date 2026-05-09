import Dropdown from './Dropdown.jsx'
import MultiSelectDropdown from './MultiSelectDropdown.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import {
  LEVELS,
  SOURCES,
  LANGUAGES,
  COUNTRY_VALUES,
  SOURCE_BY_VALUE,
  LANG_BY_VALUE,
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

  const langOpt = LANG_BY_VALUE[targetLang] || LANG_BY_VALUE.en
  const langTrigger = (
    <span className="flex items-center gap-1 text-[12px] font-semibold tracking-wide">
      <span className="text-neutral-400">→</span>
      <span>{targetLang.toUpperCase()}</span>
    </span>
  )

  const uiLangOpt = LANG_BY_VALUE[uiLang] || LANG_BY_VALUE.en
  const uiTrigger = <span className="text-[15px] leading-none">{uiLangOpt.flag}</span>

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF8]/85 backdrop-blur-md px-3 pt-4 pb-3 flex items-center gap-1.5">
      <span className="text-[22px] font-semibold tracking-[-0.02em] lowercase text-neutral-900 mr-auto pl-1.5">
        nivelo
      </span>

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
        ariaLabel={t.interfaceLang}
        triggerContent={uiTrigger}
        options={LANGUAGES}
        selected={uiLang}
        onSelect={setUiLang}
        align="right"
      />

      <Dropdown
        ariaLabel={t.translation}
        triggerContent={langTrigger}
        options={LANGUAGES}
        selected={targetLang}
        onSelect={setTargetLang}
        align="right"
      />
    </header>
  )
}
