import { useApp } from '../context/AppContext.jsx'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function LevelPills() {
  const { level, setLevel } = useApp()
  return (
    <div className="flex items-center gap-1.5 px-5">
      {LEVELS.map((lvl) => {
        const active = lvl === level
        return (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={
              'flex-1 h-9 rounded-full text-[13px] font-semibold transition-all active:scale-95 ' +
              (active
                ? 'bg-[#0A5C38] text-white shadow-[0_2px_6px_rgba(10,92,56,0.25)]'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300')
            }
          >
            {lvl}
          </button>
        )
      })}
    </div>
  )
}
