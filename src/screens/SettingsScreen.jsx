import TabBar from '../components/TabBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { ChevronRight } from 'lucide-react'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const SOURCES = ['Todas las fuentes', 'Solo Israel 🇮🇱', 'Solo España 🇪🇸']

function Row({ label, value, onClick, last }) {
  return (
    <button
      onClick={onClick}
      className={
        'w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-neutral-50 ' +
        (last ? '' : 'border-b border-neutral-100')
      }
    >
      <span className="text-[15px] text-neutral-800">{label}</span>
      <span className="flex items-center gap-1 text-[14px] text-neutral-500">
        {value}
        <ChevronRight size={16} className="text-neutral-300" strokeWidth={2.2} />
      </span>
    </button>
  )
}

export default function SettingsScreen() {
  const { level, setLevel, source, setSource } = useApp()

  const cycle = (current, options) =>
    options[(options.indexOf(current) + 1) % options.length]

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-4 pb-5">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-neutral-900">
          Ajustes
        </h1>
        <p className="text-[13px] text-neutral-500 mt-0.5">
          Personaliza tu experiencia
        </p>
      </header>

      <section className="px-4">
        <h2 className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase px-2 mb-2">
          Aprendizaje
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <Row
            label="Nivel"
            value={level}
            onClick={() => setLevel(cycle(level, LEVELS))}
          />
          <Row
            label="Fuentes"
            value={source}
            onClick={() => setSource(cycle(source, SOURCES))}
            last
          />
        </div>
      </section>

      <section className="px-4 mt-6">
        <h2 className="text-[11px] font-semibold tracking-wide text-neutral-400 uppercase px-2 mb-2">
          Acerca de
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <Row label="Versión" value="0.1" last />
        </div>
        <p className="text-[12px] text-neutral-400 text-center mt-6 leading-relaxed">
          Nivelo · Aprende español con noticias reales
          <br />
          Hecho con cariño 🇮🇱 🇪🇸
        </p>
      </section>

      <TabBar />
    </div>
  )
}
