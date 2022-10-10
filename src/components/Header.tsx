import { ActiveLink, Link } from 'raviger'
import React from 'react'
import { Moon, Sun } from 'react-feather'
import { useTheme } from '../utils/hooks/useTheme'
import { navigation } from '../utils/navigation'

interface Props {
  district?: string
}

export const Header = ({ district }: Props) => {
  const [theme, setTheme] = useTheme()
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">Coronasafe</span>
              <img
                className="h-6 w-auto invert dark:invert-0"
                src={import.meta.env.VITE_NAV_LOGO || ''}
                alt="logo"
              />
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {district &&
                navigation(district).map((link) => (
                  <ActiveLink
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-slate-50 transition-all"
                    activeClass="text-primary-500 font-medium dark:text-primary-400"
                  >
                    {link.name}
                  </ActiveLink>
                ))}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <button
              className="inline-block border-slate-200 dark:border-slate-800 p-2 border-2 rounded-md text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-opacity-75"
              onClick={() =>
                setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
              }
            >
              {/* <Sun className="p-1 text-yellow-500" /> */}
              {theme === 'light' ? (
                <Sun className="p-1 text-yellow-500" />
              ) : (
                <Moon className="p-1 text-blue-500" />
              )}
            </button>
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {district &&
            navigation(district).map((link) => (
              <ActiveLink
                key={link.name}
                href={link.href}
                className="text-base font-medium text-slate-500 dark:text-slate-400 transition-all"
                activeClass="text-primary-500 font-medium dark:text-primary-400"
              >
                {link.name}
              </ActiveLink>
            ))}
        </div>
      </nav>
    </header>
  )
}
