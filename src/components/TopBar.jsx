import { ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function TopBar() {
  const { level, setLevel, source, setSource } = useApp()

  const cycle = (current, options) => {
    const idx = options.indexOf(current)
    return options[(idx + 1) % options.length]
  }

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF8]/85 backdrop-blur-md px-5 pt-4 pb-3 flex items-center gap-2">
      <span className="text-[22px] font-semibold tracking-[-0.02em] lowercase text-neutral-900 mr-auto">
        nivelo
      </span>

      <button
        onClick={() => setLevel(cycle(level, ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']))}
        className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-800 active:scale-95 transition"
      >
        {level}
        <ChevronDown size={14} className="text-neutral-500" strokeWidth={2.5} />
      </button>

      <button
        onClick={() =>
          setSource(
            cycle(source, ['Todas las fuentes', 'Solo Israel 🇮🇱', 'Solo España 🇪🇸']),
          )
        }
        className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-800 max-w-[140px] truncate active:scale-95 transition"
      >
        <span className="truncate">{source}</span>
        <ChevronDown size={14} className="text-neutral-500 shrink-0" strokeWidth={2.5} />
      </button>
    </header>
  )
}
