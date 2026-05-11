import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { getArticleContent, getArticleSummary } from '../data/useArticles.js'
import { useT } from '../i18n/useT.js'

export default function NewsCard({ article }) {
  const { level, targetLang } = useApp()
  const t = useT()
  const content = getArticleContent(article, level, targetLang)
  const summary = getArticleSummary(article, targetLang)
  const unavailable = !content

  return (
    <article className="bg-white rounded-[20px] overflow-hidden border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.03)] flex flex-col">
      <Link to={`/article/${article.id}`} className="block relative">
        <div className="relative h-[160px] bg-neutral-100">
          <img
            src={`https://picsum.photos/seed/${encodeURIComponent(article.imageSeed || article.id)}/600/320`}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
            onError={(e) => e.currentTarget.classList.add('hidden')}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 -z-0" />
        </div>
        <span className="absolute top-3 right-3 bg-[#E8F5EE] text-[#0A5C38] text-[10.5px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
          {level}
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-[10.5px] tracking-[0.06em] text-neutral-500 font-semibold mb-2.5 flex-wrap">
          <span className="text-[15px] leading-none -mt-px">{article.flag}</span>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-neutral-700 hover:text-[#0A5C38] inline-flex items-center gap-1 underline-offset-2 hover:underline"
          >
            {article.source.toUpperCase()}
            <span className="text-neutral-400 font-medium">·{article.sourceLang}</span>
          </a>
          <span className="text-neutral-300">·</span>
          <span>{article.category}</span>
          <span className="text-neutral-300">·</span>
          <span>{article.minutes} MIN</span>
        </div>

        {unavailable ? (
          <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-xl p-4 flex items-start gap-3">
            <Loader2 size={16} className="animate-spin text-neutral-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-neutral-700">
                {t.contentLoadingTitle}
              </p>
              <p className="text-[12px] text-neutral-500 mt-1 leading-snug">
                {t.contentLoadingBody}
              </p>
            </div>
          </div>
        ) : (
          <Link to={`/article/${article.id}`} className="block">
            <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-neutral-900">
              {content.headline}
            </h2>
            {summary && (
              <p className="text-[14px] text-neutral-600 leading-snug mt-2">
                {summary}
              </p>
            )}
          </Link>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={`/article/${article.id}`}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0A5C38] hover:underline"
          >
            {t.readArticle}
            <ArrowRight size={14} strokeWidth={2.4} className="rtl:rotate-180" />
          </Link>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] text-neutral-400 hover:text-neutral-700"
            aria-label={t.viewOriginal}
          >
            <ExternalLink size={13} strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </article>
  )
}
