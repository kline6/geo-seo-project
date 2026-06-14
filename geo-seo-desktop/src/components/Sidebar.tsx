import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Search, BookOpen, BarChart3, Settings, Moon, Sun, Monitor, Globe } from 'lucide-react'
import clsx from 'clsx'
import { useSettingsStore } from '../stores/settingsStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '工作台' },
  { to: '/editor', icon: FileText, label: '内容编辑' },
  { to: '/knowledge', icon: BookOpen, label: '知识库' },
  { to: '/reports', icon: BarChart3, label: '报告' },
  { to: '/settings', icon: Settings, label: '设置' },
]

export default function Sidebar() {
  const { theme, cycleTheme } = useSettingsStore()

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-700">
        <Search className="mr-2 h-5 w-5 text-primary-600" />
        <span className="text-lg font-bold text-primary-700 dark:text-primary-400">GEO-SEO</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            )}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-200 px-3 py-3 dark:border-gray-700">
        <button onClick={cycleTheme}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
          <ThemeIcon className="h-4 w-4" />
          {theme === 'light' ? '亮色模式' : theme === 'dark' ? '暗色模式' : '跟随系统'}
        </button>
        <p className="mt-2 px-2 text-xs text-gray-400 dark:text-gray-600">GEO-SEO Desktop v0.2.0</p>
      </div>
    </aside>
  )
}