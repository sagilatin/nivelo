import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import ArticleScreen from './screens/ArticleScreen.jsx'
import VocabularyScreen from './screens/VocabularyScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import WelcomeScreen from './screens/WelcomeScreen.jsx'
import { useApp } from './context/AppContext.jsx'

// Redirects first-time visitors (no `onboarded` flag) to the welcome screen.
// Everything else passes through.
function OnboardingGate({ children }) {
  const { onboarded } = useApp()
  const location = useLocation()
  if (!onboarded && location.pathname !== '/welcome') {
    const search = location.search || ''
    return <Navigate to={`/welcome${search}`} replace />
  }
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
      <div className="w-full max-w-[420px] sm:max-w-[760px] md:max-w-[900px] min-h-screen bg-[#FAFAF8] relative overflow-hidden md:shadow-[0_0_40px_rgba(0,0,0,0.04)]">
        <Routes>
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route
            path="/"
            element={
              <OnboardingGate>
                <HomeScreen />
              </OnboardingGate>
            }
          />
          <Route
            path="/article/:id"
            element={
              <OnboardingGate>
                <ArticleScreen />
              </OnboardingGate>
            }
          />
          <Route
            path="/palabras"
            element={
              <OnboardingGate>
                <VocabularyScreen />
              </OnboardingGate>
            }
          />
          <Route
            path="/ajustes"
            element={
              <OnboardingGate>
                <SettingsScreen />
              </OnboardingGate>
            }
          />
        </Routes>
      </div>
    </div>
  )
}
