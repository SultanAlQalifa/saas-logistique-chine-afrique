'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'

const themes = [
  {
    value: 'light' as const,
    label: 'Mode clair',
    icon: Sun,
  },
  {
    value: 'dark' as const,
    label: 'Mode sombre',
    icon: Moon,
  },
  {
    value: 'auto' as const,
    label: 'Automatique',
    icon: Monitor,
  },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  return (
    <div className="relative inline-block text-left">
      <div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <span className="sr-only">Changer le thème</span>
          <currentTheme.icon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
          <div className="py-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value)
                  setIsOpen(false)
                }}
                className={`${
                  theme === themeOption.value
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                } group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <themeOption.icon className="mr-3 h-5 w-5" />
                {themeOption.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Simple toggle version for header
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('auto')
    } else {
      setTheme('light')
    }
  }

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
      title={`Mode actuel: ${currentTheme.label}`}
    >
      <span className="sr-only">Changer le thème</span>
      <currentTheme.icon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
