import { useMemo } from 'react'
import TopBar from '../components/TopBar.jsx'
import NewsCard from '../components/NewsCard.jsx'
import TabBar from '../components/TabBar.jsx'
import { articles } from '../data/articles.js'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import { COUNTRY_VALUES } from '../data/constants.js'

export default function HomeScreen() {
  const { sources } = useApp()
  const t = useT()

  const filtered = useMemo(() => {
    const allOn = COUNTRY_VALUES.every((v) => sources.includes(v))
    if (allOn) return articles
    return articles.filter((a) => sources.includes(a.country))
  }, [sources])

  return (
    <div className="min-h-screen pb-28">
      <TopBar />

      <div className="px-5 pt-3 pb-5">
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900">
          {t.goodMorning}
        </h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">
          {filtered.length} {filtered.length === 1 ? t.storyToday : t.storiesToday} · 9 de mayo
        </p>
      </div>

      <div key={sources.join(',')} className="anim-fade-in px-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-[15px] font-semibold text-neutral-700">
              {t.noStoriesForFilter}
            </p>
            <p className="text-[13px] text-neutral-500 mt-1.5">{t.tryOtherFilter}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
            <div className="text-center text-[12px] text-neutral-400 py-6">
              {t.endOfFeed}
            </div>
          </>
        )}
      </div>

      <TabBar />
    </div>
  )
}
