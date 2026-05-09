import { useState } from 'react'
import TabBar from '../components/TabBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { Trash2 } from 'lucide-react'

function FlashCard({ word }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="w-full bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-5 text-left active:scale-[0.99] transition flex items-center justify-between gap-4 min-h-[80px]"
    >
      {flipped ? (
        <span
          className="text-[22px] font-hebrew text-neutral-900 w-full text-right"
          dir="rtl"
        >
          {word.hebrew}
        </span>
      ) : (
        <span className="text-[18px] font-semibold text-neutral-900 tracking-[-0.01em]">
          {word.spanish}
        </span>
      )}
      <span className="text-[10.5px] tracking-wide font-semibold text-neutral-400 uppercase shrink-0">
        {flipped ? 'HE' : 'ES'}
      </span>
    </button>
  )
}

export default function VocabularyScreen() {
  const { vocabulary, clearVocabulary } = useApp()
  const words = vocabulary.filter((w) => !w.spanish.startsWith('__article:'))

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-20 bg-[#FAFAF8]/85 backdrop-blur-md px-5 pt-4 pb-3 flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-neutral-900">
            Palabras
          </h1>
          <p className="text-[13px] text-neutral-500 mt-0.5">
            {words.length === 0
              ? 'Aún no has guardado ninguna palabra'
              : `${words.length} ${words.length === 1 ? 'palabra guardada' : 'palabras guardadas'}`}
          </p>
        </div>
        {words.length > 0 && (
          <button
            onClick={() => {
              if (confirm('¿Borrar todas las palabras guardadas?')) clearVocabulary()
            }}
            className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg"
          >
            <Trash2 size={14} strokeWidth={2.2} /> Borrar todo
          </button>
        )}
      </header>

      <div className="px-5 mt-2">
        <p className="text-[12px] text-neutral-400 mb-3">
          Toca una tarjeta para girarla y ver la traducción.
        </p>
      </div>

      <div className="px-5 space-y-2.5">
        {words.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-[15px] font-semibold text-neutral-700">
              Tu lista está vacía
            </p>
            <p className="text-[13px] text-neutral-500 mt-1.5 leading-snug">
              Toca cualquier palabra dentro de un artículo y pulsa{' '}
              <span className="font-semibold text-neutral-700">Guardar</span> para
              añadirla aquí.
            </p>
          </div>
        ) : (
          words.map((w) => <FlashCard key={w.spanish} word={w} />)
        )}
      </div>

      <TabBar />
    </div>
  )
}
