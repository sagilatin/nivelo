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

// Interface language — controls UI strings + page direction.
// `dir: 'rtl'` triggers a full right-to-left layout.
export const LANGUAGES = [
  { value: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { value: 'he', label: 'עברית',    flag: '🇮🇱', dir: 'rtl' },
  { value: 'de', label: 'Deutsch',  flag: '🇩🇪', dir: 'ltr' },
  { value: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { value: 'ja', label: '日本語',    flag: '🇯🇵', dir: 'ltr' },
]

// Practice language — the language the user is LEARNING.
// Article body, headlines, summaries, and quizzes are produced in this
// language. Order and default match the product brief: Spanish first.
export const PRACTICE_LANGUAGES = [
  { value: 'es', label: 'Spanish',  nameEn: 'Spanish',  flag: '🇪🇸' },
  { value: 'fr', label: 'French',   nameEn: 'French',   flag: '🇫🇷' },
  { value: 'de', label: 'German',   nameEn: 'German',   flag: '🇩🇪' },
  { value: 'it', label: 'Italian',  nameEn: 'Italian',  flag: '🇮🇹' },
  { value: 'ja', label: 'Japanese', nameEn: 'Japanese', flag: '🇯🇵' },
  { value: 'en', label: 'English',  nameEn: 'English',  flag: '🇬🇧' },
]
export const DEFAULT_PRACTICE_LANG = 'es'

export const SOURCE_BY_VALUE = Object.fromEntries(SOURCES.map((s) => [s.value, s]))
export const LANG_BY_VALUE = Object.fromEntries(LANGUAGES.map((l) => [l.value, l]))
export const PRACTICE_LANG_BY_VALUE = Object.fromEntries(
  PRACTICE_LANGUAGES.map((l) => [l.value, l]),
)

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
