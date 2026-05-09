import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { getArticleContent } from '../data/articles.js'

export default function NewsCard({ article }) {
  const { level } = useApp()
  const { headline } = getArticleContent(article, level)

  return (
    <Link
      to={`/article/${article.id}`}
      className="block bg-white rounded-[20px] p-5 border border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.03)] active:scale-[0.99] transition relative"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10.5px] tracking-[0.06em] text-neutral-500 font-semibold mb-2.5">
            <span className="text-[15px] leading-none -mt-px">{article.flag}</span>
            <span>{article.source.toUpperCase()}</span>
            <span className="text-neutral-300">·</span>
            <span>{article.category}</span>
            <span className="text-neutral-300">·</span>
            <span>{article.minutes} MIN</span>
          </div>
          <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-neutral-900">
            {headline}
          </h2>
          <p className="text-[14px] text-neutral-600 leading-snug mt-2">
            {article.summary}
          </p>
        </div>
        <span className="bg-[#E8F5EE] text-[#0A5C38] text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 tracking-wide">
          {level}
        </span>
      </div>
    </Link>
  )
}
