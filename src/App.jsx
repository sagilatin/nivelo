import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import ArticleScreen from './screens/ArticleScreen.jsx'
import VocabularyScreen from './screens/VocabularyScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
      <div className="w-full max-w-[420px] sm:max-w-[760px] md:max-w-[900px] min-h-screen bg-[#FAFAF8] relative overflow-hidden md:shadow-[0_0_40px_rgba(0,0,0,0.04)]">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/article/:id" element={<ArticleScreen />} />
          <Route path="/palabras" element={<VocabularyScreen />} />
          <Route path="/ajustes" element={<SettingsScreen />} />
        </Routes>
      </div>
    </div>
  )
}
