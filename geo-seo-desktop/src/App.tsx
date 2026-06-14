import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import AuditPage from './pages/AuditPage'
import Knowledge from './pages/Knowledge'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import SeoGeoDiagnosis from './pages/SeoGeoDiagnosis'
import { useSettingsStore } from './stores/settingsStore'

export default function App() {
  const loadSettings = useSettingsStore(s => s.loadSettings)

  useEffect(() => {
    loadSettings()
    // Listen for system theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', () => {
      const current = useSettingsStore.getState().theme
      if (current === 'system') {
        document.documentElement.classList.toggle('dark', mq.matches)
      }
    })
  }, [])

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-950">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/audit/:id" element={<AuditPage />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}