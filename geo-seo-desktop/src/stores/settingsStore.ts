import { create } from 'zustand'
import type { AppSettings } from '../types'

interface SettingsStore {
  theme: 'light' | 'dark' | 'system'
  settings: Partial<AppSettings>
  loaded: boolean
  cycleTheme: () => void
  loadSettings: () => Promise<void>
  saveSettings: (data: Partial<AppSettings>) => Promise<void>
}

const api = window.electronAPI

function applyTheme(theme: string) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (theme === 'dark') root.classList.add('dark')
  else if (theme === 'light') root.classList.add('light')
  else {
    // system
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark')
    else root.classList.add('light')
  }
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: 'system',
  settings: {},
  loaded: false,

  cycleTheme: () => {
    const current = get().theme
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
    set({ theme: next })
    applyTheme(next)
    api.invoke('settings.update', { theme: next })
  },

  loadSettings: async () => {
    try {
      const res = (await api.invoke('settings.get')) as any
      if (res.success) {
        const theme = res.data.theme || 'system'
        set({ settings: res.data, theme: theme as any, loaded: true })
        applyTheme(theme)
      }
    } catch { set({ loaded: true }) }
  },

  saveSettings: async (data) => {
    await api.invoke('settings.update', data)
    const res = (await api.invoke('settings.get')) as any
    if (res.success) set({ settings: res.data })
  },
}))