// Single source of truth for the level / source / language pickers.
// Imported by TopBar, SettingsScreen, HomeScreen, etc.

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const SOURCES = [
  { value: 'all',    label: 'Todas',  flag: '🌍' },
  { value: 'IL',     label: 'Israel', flag: '🇮🇱' },
  { value: 'ES',     label: 'España', flag: '🇪🇸' },
  { value: 'US',     label: 'USA',    flag: '🇺🇸' },
  { value: 'GLOBAL', label: 'Global', flag: '🌐' },
  { value: 'IT',     label: 'Italia', flag: '🇮🇹' },
  { value: 'FR',     label: 'Francia',flag: '🇫🇷' },
  { value: 'JP',     label: 'Japón',  flag: '🇯🇵' },
]
export const COUNTRY_VALUES = SOURCES.filter((s) => s.value !== 'all').map((s) => s.value)

// Languages used both for word-tap translation and for the interface.
// `dir: 'rtl'` triggers a full right-to-left layout.
export const LANGUAGES = [
  { value: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { value: 'he', label: 'עברית',    flag: '🇮🇱', dir: 'rtl' },
  { value: 'de', label: 'Deutsch',  flag: '🇩🇪', dir: 'ltr' },
  { value: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { value: 'ja', label: '日本語',    flag: '🇯🇵', dir: 'ltr' },
]

export const SOURCE_BY_VALUE = Object.fromEntries(SOURCES.map((s) => [s.value, s]))
export const LANG_BY_VALUE = Object.fromEntries(LANGUAGES.map((l) => [l.value, l]))

// Pick the best UI language match from the browser's preferred languages,
// defaulting to English. Called once on first load.
export function detectBrowserLang() {
  if (typeof navigator === 'undefined') return 'en'
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || 'en']
  for (const c of candidates) {
    const short = String(c).toLowerCase().slice(0, 2)
    if (LANG_BY_VALUE[short]) return short
  }
  return 'en'
}
