import { useApp } from '../context/AppContext.jsx'
import { T } from './strings.js'

export function useT() {
  const { uiLang } = useApp()
  return T[uiLang] || T.en
}
