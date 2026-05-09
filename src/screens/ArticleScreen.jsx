import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal, Bookmark, BookmarkCheck } from 'lucide-react'
import LevelPills from '../components/LevelPills.jsx'
import QuizModal from '../components/QuizModal.jsx'
import TappableWord from '../components/TappableWord.jsx'
import { getArticleById, getArticleContent } from '../data/articles.js'
import { getQuizForArticle } from '../data/quizzes.js'
import { useApp } from '../context/AppContext.jsx'

function RichParagraph({ segments, activeKey, onTap, onDismiss, paraIndex }) {
  return (
    <p className="text-[16px] leading-[1.65] text-neutral-800">
      {segments.map((seg, i) => {
        if (!seg.hebrew) return <span key={i}>{seg.text}</span>
        const key = `${paraIndex}-${i}`
        return (
          <TappableWord
            key={key}
            word={seg.text}
            hebrew={seg.hebrew}
            isActive={activeKey === key}
            onTap={() => onTap(key)}
            onDismiss={onDismiss}
          />
        )
      })}
    </p>
  )
}

export default function ArticleScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const article = getArticleById(id)
  const quiz = getQuizForArticle(id)
  const { vocabulary, addWord, removeWord, level } = useApp()
  const { headline, body } = getArticleContent(article, level)

  const [activeKey, setActiveKey] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  useEffect(() => { setActiveKey(null) }, [level])
  const bookmarked = vocabulary.some((w) => w.articleId === article.id)

  const toggleBookmark = () => {
    if (bookmarked) removeWord(`__article:${article.id}`)
    else
      addWord({
        spanish: `__article:${article.id}`,
        hebrew: headline,
        articleId: article.id,
      })
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-[#FAFAF8]/85 backdrop-blur-md px-3 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:scale-95 transition"
          aria-label="Volver"
        >
          <ArrowLeft size={22} strokeWidth={2.2} />
        </button>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:scale-95 transition"
          aria-label="Más opciones"
        >
          <MoreHorizontal size={22} strokeWidth={2.2} />
        </button>
      </header>

      {/* Level pills */}
      <div className="pt-1 pb-5">
        <LevelPills />
      </div>

      {/* Article */}
      <article className="px-5">
        <h1
          key={`title-${level}`}
          className="anim-fade-in text-[28px] font-bold leading-[1.18] tracking-[-0.015em] text-neutral-900"
        >
          {headline}
        </h1>

        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-neutral-500 font-medium">
          <span className="text-[14px] leading-none">{article.flag}</span>
          <span>{article.source}</span>
          <span className="text-neutral-300">·</span>
          <span>{article.date}</span>
          <span className="text-neutral-300">·</span>
          <span>{article.minutes} min</span>
        </div>

        <div key={level} className="anim-fade-in mt-6 space-y-5">
          {body.map((segments, idx) => (
            <RichParagraph
              key={idx}
              paraIndex={idx}
              segments={segments}
              activeKey={activeKey}
              onTap={setActiveKey}
              onDismiss={() => setActiveKey(null)}
            />
          ))}
        </div>

        <p className="mt-6 text-[12px] text-neutral-400">
          Toca cualquier palabra subrayada para ver la traducción al hebreo.
        </p>
      </article>

      {/* Floating action bar */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-5 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setQuizOpen(true)}
            className="flex-1 h-13 py-4 rounded-2xl bg-[#0A5C38] text-white text-[15px] font-semibold shadow-[0_4px_14px_rgba(10,92,56,0.25)] hover:bg-[#084a2d] active:scale-[0.99] transition"
          >
            Hacer el test →
          </button>
          <button
            onClick={toggleBookmark}
            aria-label="Guardar artículo"
            className={
              'w-13 h-13 p-4 rounded-2xl flex items-center justify-center transition active:scale-95 ' +
              (bookmarked
                ? 'bg-[#E8F5EE] text-[#0A5C38] border border-[#0A5C38]/20'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300')
            }
          >
            {bookmarked ? (
              <BookmarkCheck size={20} strokeWidth={2.2} />
            ) : (
              <Bookmark size={20} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} questions={quiz} />
    </div>
  )
}
