import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Settings } from 'lucide-react'

const TABS = [
  { to: '/', label: 'Inicio', icon: Home, match: (p) => p === '/' || p.startsWith('/article') },
  { to: '/palabras', label: 'Palabras', icon: BookOpen, match: (p) => p.startsWith('/palabras') },
  { to: '/ajustes', label: 'Ajustes', icon: Settings, match: (p) => p.startsWith('/ajustes') },
]

export default function TabBar() {
  const { pathname } = useLocation()
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20">
      <div className="bg-white/90 backdrop-blur-md border-t border-neutral-200/80 px-2 pt-1.5 pb-3">
        <ul className="flex items-stretch justify-around">
          {TABS.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname)
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className="flex flex-col items-center justify-center gap-0.5 py-1.5 active:scale-95 transition"
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.4 : 1.8}
                    className={active ? 'text-[#0A5C38]' : 'text-neutral-400'}
                  />
                  <span
                    className={
                      'text-[10.5px] font-medium ' +
                      (active ? 'text-[#0A5C38]' : 'text-neutral-500')
                    }
                  >
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
