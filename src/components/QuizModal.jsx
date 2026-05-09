import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useT } from '../i18n/useT.js'

const CATEGORY_KEY = {
  Vocabulario: 'catVocabulary',
  Comprensión: 'catComprehension',
  Gramática: 'catGrammar',
}

export default function QuizModal({ open, onClose, questions }) {
  const t = useT()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const total = questions.length
  const q = questions[step]

  useEffect(() => {
    if (!open) return
    setStep(0)
    setSelected(null)
    setSubmitted(false)
    setScore(0)
    setDone(false)
  }, [open])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  const isLast = step === total - 1
  const correct = selected === q?.correctIndex

  const handleNext = () => {
    if (selected === null) return
    if (!submitted) {
      setSubmitted(true)
      if (correct) setScore((s) => s + 1)
      return
    }
    if (isLast) {
      setDone(true)
    } else {
      setStep((s) => s + 1)
      setSelected(null)
      setSubmitted(false)
    }
  }

  return (
    <div className="absolute inset-0 z-50">
      <button aria-label={t.quizClose} onClick={onClose} className="absolute inset-0 bg-black/40 anim-fade-in" />
      <div className="absolute left-0 right-0 bottom-0 anim-slide-up">
        <div className="bg-white rounded-t-[28px] pb-7 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] max-h-[88%] flex flex-col">
          <div className="pt-3 pb-1 flex justify-center">
            <span className="block w-10 h-1.5 rounded-full bg-neutral-300" />
          </div>

          {!done && (
            <div className="px-5 pt-2 pb-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5 flex-1">
                {Array.from({ length: total }).map((_, i) => {
                  const state = i < step ? 'done' : i === step ? 'current' : 'todo'
                  return (
                    <span
                      key={i}
                      className={
                        'h-2 rounded-full transition-all ' +
                        (state === 'done'
                          ? 'w-2 bg-[#0A5C38]'
                          : state === 'current'
                            ? 'w-6 bg-[#0A5C38]'
                            : 'w-2 bg-neutral-200')
                      }
                    />
                  )
                })}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100">
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
          )}

          {!done ? (
            <>
              <div className="px-5 overflow-y-auto no-scrollbar">
                <span className="inline-flex items-center bg-[#E8F5EE] text-[#0A5C38] text-[12px] font-semibold px-2.5 py-1 rounded-full">
                  {t[CATEGORY_KEY[q.type]] || q.type} · {step + 1} / {total}
                </span>
                <h2 className="mt-4 text-[22px] font-semibold leading-snug tracking-[-0.01em] text-neutral-900">
                  {q.question}
                </h2>

                <div className="mt-5 space-y-2.5">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i
                    const isCorrect = i === q.correctIndex
                    let stateClass = 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                    if (submitted) {
                      if (isCorrect) stateClass = 'border-[#0A5C38] bg-[#E8F5EE] text-[#0A5C38] ring-2 ring-[#0A5C38]/20'
                      else if (isSelected) stateClass = 'border-red-300 bg-red-50 text-red-700'
                      else stateClass = 'border-neutral-200 bg-white text-neutral-500'
                    } else if (isSelected) {
                      stateClass = 'border-[#0A5C38] bg-[#E8F5EE] text-[#0A5C38] ring-2 ring-[#0A5C38]/20'
                    }
                    return (
                      <button
                        key={i}
                        disabled={submitted}
                        onClick={() => setSelected(i)}
                        className={'w-full text-left rounded-2xl border-2 p-4 text-[15px] font-medium flex items-center justify-between gap-3 transition active:scale-[0.99] ' + stateClass}
                      >
                        <span className="flex-1">{opt}</span>
                        {submitted && isCorrect && <Check size={18} className="text-[#0A5C38]" strokeWidth={2.6} />}
                        {!submitted && isSelected && <Check size={18} className="text-[#0A5C38]" strokeWidth={2.6} />}
                      </button>
                    )
                  })}
                </div>

                {submitted && (
                  <p className={'mt-4 text-[14px] font-medium ' + (correct ? 'text-[#0A5C38]' : 'text-red-600')}>
                    {correct ? t.correctMsg : `${t.almostMsg} "${q.options[q.correctIndex]}".`}
                  </p>
                )}
              </div>

              <div className="px-5 pt-4 mt-2">
                <button
                  disabled={selected === null}
                  onClick={handleNext}
                  className={
                    'w-full py-4 rounded-2xl text-[15px] font-semibold transition active:scale-[0.99] ' +
                    (selected === null
                      ? 'bg-neutral-200 text-neutral-400'
                      : 'bg-[#0A5C38] text-white shadow-[0_4px_14px_rgba(10,92,56,0.25)] hover:bg-[#084a2d]')
                  }
                >
                  {!submitted ? t.check : isLast ? t.finish : t.next + ' →'}
                </button>
              </div>
            </>
          ) : (
            <div className="px-6 pt-2 pb-2 text-center">
              <h2 className="text-[26px] font-bold text-neutral-900">{t.quizDone}</h2>
              <p className="text-[14px] text-neutral-500 mt-1">{t.quizScore}</p>
              <div className="my-6 inline-flex items-baseline gap-1">
                <span className="text-[56px] font-bold text-[#0A5C38] leading-none tracking-tight">{score}</span>
                <span className="text-[20px] text-neutral-400 font-medium">/ {total}</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-[#0A5C38] text-white text-[15px] font-semibold shadow-[0_4px_14px_rgba(10,92,56,0.25)] hover:bg-[#084a2d] active:scale-[0.99] transition"
              >
                {t.quizClose}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
