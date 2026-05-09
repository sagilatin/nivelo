import { useMemo } from 'react'
import TopBar from '../components/TopBar.jsx'
import NewsCard from '../components/NewsCard.jsx'
import TabBar from '../components/TabBar.jsx'
import { articles } from '../data/articles.js'
import { useApp } from '../context/AppContext.jsx'

export default function HomeScreen() {
  const { source } = useApp()

  const filtered = useMemo(() => {
    if (source.includes('Israel')) return articles.filter((a) => a.flag === '🇮🇱')
    if (source.includes('España')) return articles.filter((a) => a.flag === '🇪🇸')
    return articles
  }, [source])

  return (
    <div className="min-h-screen pb-28">
      <TopBar />

      <div className="px-5 pt-3 pb-5">
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900">
          Buenos días
        </h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">
          {filtered.length} historias hoy · 9 de mayo
        </p>
      </div>

      <div className="px-4 space-y-3">
        {filtered.map((a) => (
          <NewsCard key={a.id} article={a} />
        ))}
        <div className="text-center text-[12px] text-neutral-400 py-6">
          Has llegado al final · vuelve mañana
        </div>
      </div>

      <TabBar />
    </div>
  )
}
