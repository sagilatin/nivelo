import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Reusable pill-style dropdown.
// Props:
//   triggerContent — ReactNode shown inside the closed pill (e.g. "B1" or "🌍")
//   options        — [{ value, label, flag? }]
//   selected       — current value
//   onSelect(value)
//   align          — 'right' | 'left' (where the menu anchors)
//   menuClassName  — extra classes for the menu (e.g. min-width)
export default function Dropdown({
  triggerContent,
  ariaLabel,
  options,
  selected,
  onSelect,
  align = 'right',
  menuClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

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

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full pl-3 pr-2 py-1.5 text-[13px] font-medium text-neutral-800 active:scale-95 transition hover:border-neutral-300"
      >
        <span className="leading-none">{triggerContent}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={'text-neutral-500 transition-transform ' + (open ? 'rotate-180' : '')}
        />
      </button>

      {open && (
        <div
          className={
            'absolute top-full mt-2 z-[9999] anim-pop-in ' +
            (align === 'right' ? 'right-0' : 'left-0') +
            ' ' +
            menuClassName
          }
          style={{ transformOrigin: align === 'right' ? 'top right' : 'top left' }}
        >
          <ul
            role="listbox"
            className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1.5 min-w-[160px] max-h-[60vh] overflow-y-auto no-scrollbar"
          >
            {options.map((opt) => {
              const isSel = opt.value === selected
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    onClick={() => { onSelect(opt.value); setOpen(false) }}
                    className={
                      'w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] transition ' +
                      (isSel
                        ? 'text-[#0A5C38] font-semibold bg-[#E8F5EE]/50'
                        : 'text-neutral-800 hover:bg-neutral-50')
                    }
                  >
                    {opt.flag && <span className="text-[16px] leading-none">{opt.flag}</span>}
                    <span className="flex-1">{opt.label}</span>
                    {isSel && <Check size={14} strokeWidth={2.8} />}
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
