import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal, Bookmark, BookmarkCheck, ExternalLink, Loader2 } from 'lucide-react'
import LevelPills from '../components/LevelPills.jsx'
import QuizModal from '../components/QuizModal.jsx'
import TappableWord from '../components/TappableWord.jsx'
import Image from '../components/Image.jsx'
import {
  useArticles,
  findArticleById,
  getArticleContent,
  getArticleQuiz,
} from '../data/useArticles.js'
import { useEnsureTranslation } from '../data/useEnsureTranslation.js'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'

function RichParagraph({ segments, paraIndex, articleLang, activeKey, handlers }) {
  return (
    <p className="text-[16px] leading-[1.65] text-neutral-800">
      {segments.map((seg, i) => {
        if (!seg.t) return <span key={i}>{seg.text}</span>
        const key = `${paraIndex}-${i}`
        const isActive = activeKey === key
        return (
          <TappableWord
            key={key}
            word={seg.text}
            sourceLang={articleLang}
            isActive={isActive}
            onShow={() => handlers.show(key)}
            onScheduleHide={handlers.scheduleHide}
            onCancelHide={handlers.cancelHide}
            onToggleClick={() => (isActive ? handlers.hideNow() : handlers.show(key))}
            onDismissNow={handlers.hideNow}
          />
        )
      })}
    </p>
  )
}

export default function ArticleScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { articles } = useArticles()
  const rawArticle = findArticleById(articles, id)
  const t = useT()
  const { vocabulary, addWord, removeWord, level, targetLang } = useApp()
  const needsTranslation = !getArticleContent(rawArticle, level, targetLang)
  const { article } = useEnsureTranslation(rawArticle, targetLang, needsTranslation)
  const content = getArticleContent(article, level, targetLang)
  const quiz = getArticleQuiz(article, targetLang)
  const unavailable = !content

  const [activeKey, setActiveKey] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const closeTimerRef = useRef(null)

  useEffect(() => { setActiveKey(null) }, [level, targetLang])
  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  const handlers = {
    show: (key) => { clearTimeout(closeTimerRef.current); setActiveKey(key) },
    cancelHide: () => clearTimeout(closeTimerRef.current),
    scheduleHide: () => {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => setActiveKey(null), 150)
    },
    hideNow: () => { clearTimeout(closeTimerRef.current); setActiveKey(null) },
  }

  const bookmarked = vocabulary.some((w) => w.articleId === article.id)
  const toggleBookmark = () => {
    if (bookmarked) removeWord(`__article:${article.id}`)
    else addWord({ spanish: `__article:${article.id}`, articleId: article.id })
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 bg-white/85 backdrop-blur-sm shadow-sm active:scale-95 transition"
          aria-label={t.back}
        >
          <ArrowLeft size={20} strokeWidth={2.2} className="rtl:rotate-180" />
        </button>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 bg-white/85 backdrop-blur-sm shadow-sm active:scale-95 transition"
          aria-label={t.moreOptions}
        >
          <MoreHorizontal size={20} strokeWidth={2.2} />
        </button>
      </header>

      <Image
        seed={article.imageSeed || article.id}
        width={780}
        height={440}
        rounded="bottom"
        className="h-[220px]"
      />

      <div className="pt-5 pb-3">
        <LevelPills />
      </div>

      <article className="px-5">
        {unavailable ? (
          <div className="mt-2 bg-white rounded-2xl border border-dashed border-neutral-200 p-6 text-center">
            <Loader2 size={20} className="animate-spin text-neutral-400 inline-block" />
            <h1 className="mt-3 text-[19px] font-semibold text-neutral-800">
              {t.contentLoadingTitle}
            </h1>
            <p className="mt-2 text-[13.5px] text-neutral-500 leading-snug">
              {t.contentLoadingBody}
            </p>
          </div>
        ) : (
          <>
            <h1
              key={`title-${level}-${targetLang}`}
              className="anim-fade-in text-[26px] font-bold leading-[1.18] tracking-[-0.015em] text-neutral-900"
            >
              {content.headline}
            </h1>

            <div className="mt-3 flex items-center gap-1.5 text-[12px] text-neutral-500 font-medium flex-wrap">
              <span className="text-[14px] leading-none">{article.flag}</span>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-[#0A5C38] underline-offset-2 hover:underline"
              >
                {article.source}
                <span className="text-neutral-400 font-medium ms-1">·{article.sourceLang}</span>
              </a>
              <span className="text-neutral-300">·</span>
              <span>{article.date}</span>
              <span className="text-neutral-300">·</span>
              <span>{article.minutes} min</span>
            </div>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#0A5C38] hover:underline"
            >
              {t.viewOriginal}
              <ExternalLink size={13} strokeWidth={2.4} />
            </a>

            <div key={`${level}-${targetLang}`} className="anim-fade-in mt-5 space-y-5">
              {content.body.map((segments, idx) => (
                <RichParagraph
                  key={idx}
                  paraIndex={idx}
                  segments={segments}
                  articleLang={targetLang}
                  activeKey={activeKey}
                  handlers={handlers}
                />
              ))}
            </div>

            <p className="mt-6 text-[12px] text-neutral-400">{t.hoverHint}</p>
          </>
        )}
      </article>

      {!unavailable && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-5 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setQuizOpen(true)}
              disabled={!quiz?.length}
              className={
                'flex-1 py-4 rounded-2xl text-[15px] font-semibold transition active:scale-[0.99] ' +
                (quiz?.length
                  ? 'bg-[#0A5C38] text-white shadow-[0_4px_14px_rgba(10,92,56,0.25)] hover:bg-[#084a2d]'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed')
              }
            >
              {t.testYourself} →
            </button>
            <button
              onClick={toggleBookmark}
              aria-label={t.bookmark}
              className={
                'p-4 rounded-2xl flex items-center justify-center transition active:scale-95 ' +
                (bookmarked
                  ? 'bg-[#E8F5EE] text-[#0A5C38] border border-[#0A5C38]/20'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300')
              }
            >
              {bookmarked ? <BookmarkCheck size={20} strokeWidth={2.2} /> : <Bookmark size={20} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      )}

      {quiz?.length > 0 && (
        <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} questions={quiz} />
      )}
    </div>
  )
}
