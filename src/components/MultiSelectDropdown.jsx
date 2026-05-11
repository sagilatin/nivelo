import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Multi-select dropdown with a special "all" item that selects/deselects every
// other option in one click. Doesn't auto-close on selection — closes only on
// outside click or Esc.
//
// Props:
//   triggerContent   ReactNode shown inside the closed pill
//   options          [{ value, label, flag? }]   — must include an `all` value
//   selected         string[]                    — array of selected non-`all` values
//   onChange(values) — fires with the new array
//   align            'right' | 'left'
export default function MultiSelectDropdown({
  triggerContent,
  ariaLabel,
  options,
  selected,
  onChange,
  align = 'right',
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const ALL = 'all'
  const allValues = options.filter((o) => o.value !== ALL).map((o) => o.value)
  const allSelected = allValues.every((v) => selected.includes(v))

  useEffect(() => {
    if (!open) return
    const handleAway = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false)
    }
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleAway)
    document.addEventListener('touchstart', handleAway)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleAway)
      document.removeEventListener('touchstart', handleAway)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  const toggle = (value) => {
    if (value === ALL) {
      onChange(allSelected ? [] : allValues)
      return
    }
    const isSel = selected.includes(value)
    if (isSel) onChange(selected.filter((v) => v !== value))
    else onChange([...selected, value])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full pl-3 pr-2 py-1.5 text-[13px] font-medium text-neutral-800 active:scale-95 transition hover:border-neutral-300 max-w-[140px]"
      >
        <span className="leading-none truncate">{triggerContent}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={'text-neutral-500 transition-transform shrink-0 ' + (open ? 'rotate-180' : '')}
        />
      </button>

      {open && (
        <div
          className={
            'absolute top-full mt-2 z-[9999] anim-pop-in ' +
            (align === 'right' ? 'right-0' : 'left-0')
          }
          style={{ transformOrigin: align === 'right' ? 'top right' : 'top left' }}
        >
          <ul
            role="listbox"
            aria-multiselectable
            className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1.5 min-w-[200px] max-h-[60vh] overflow-y-auto no-scrollbar"
          >
            {options.map((opt) => {
              const isAll = opt.value === ALL
              const isChecked = isAll ? allSelected : selected.includes(opt.value)
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isChecked}
                    onClick={() => toggle(opt.value)}
                    className={
                      'w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] transition ' +
                      (isChecked
                        ? 'text-[#0A5C38] font-semibold bg-[#E8F5EE]/50'
                        : 'text-neutral-800 hover:bg-neutral-50')
                    }
                  >
                    <span
                      className={
                        'shrink-0 w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center transition ' +
                        (isChecked
                          ? 'bg-[#0A5C38] border-[#0A5C38]'
                          : 'bg-white border-neutral-300')
                      }
                    >
                      {isChecked && <Check size={11} strokeWidth={3.2} className="text-white" />}
                    </span>
                    {opt.flag && <span className="text-[16px] leading-none">{opt.flag}</span>}
                    <span className="flex-1">{opt.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
