import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Heart,
  LayoutGrid,
  LogIn,
  Menu,
  ShoppingBag,
  UserPlus,
  X,
  Globe,
} from 'lucide-react'

import { Container } from '../common/Container'
import { layoutAssetsData } from '../../data/layoutData'
import { NAV_LINKS, LANGUAGES } from '../../data/navLinks'
import { useCart } from '../../context/CartContext'
import useWishlist from '../../hooks/useWishlist'
import Sidebar from './Sidebar'

const LANG_CODES = LANGUAGES.map((l) => l.value)

const normalizeLang = (lng) => {
  const base = String(lng || 'en').split('-')[0]
  return LANG_CODES.includes(base) ? base : 'en'
}

function IconLink({ to, label, count, children }) {
  const { t } = useTranslation()

  return (
    <Link
      to={to}
      aria-label={
        count
          ? t('header.aria.icon_with_count', { label, total: count })
          : label
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-neutral-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
    >
      {children}

      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-dark px-1 text-[11px] font-medium text-white shadow-sm"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}

function LanguageSelect({ id, label, value, onChange, mobile = false }) {
  return (
    <div>
      {mobile && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          {label}
        </label>
      )}

      <div
        className={
          mobile
            ? 'flex h-12 w-full items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 focus-within:ring-2 focus-within:ring-brand-dark'
            : 'flex h-10 items-center gap-1.5 rounded-md border border-neutral-200 bg-white/50 px-2 text-brand-dark focus-within:ring-2 focus-within:ring-brand-dark'
        }
      >
        <Globe
          size={mobile ? 18 : 15}
          aria-hidden="true"
          className={`shrink-0 ${
            mobile ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        />

        <select
          id={id}
          value={value}
          onChange={onChange}
          aria-label={mobile ? undefined : label}
          className={
            mobile
              ? 'w-full cursor-pointer bg-transparent text-sm font-medium text-brand-dark focus:outline-none'
              : 'cursor-pointer bg-transparent pr-1 text-xs font-medium focus:outline-none'
          }
        >
          {LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const desktopLink = ({ isActive }) =>
  `text-sm tracking-wide transition-all duration-200 hover:text-brand-dark relative py-2 ${
    isActive
      ? 'font-medium text-brand-dark after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-brand-dark after:rounded-full'
      : 'text-brand-gray/90'
  }`

const mobileLink = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-base transition-all duration-200 ${
    isActive
      ? 'bg-neutral-900 font-medium text-white'
      : 'text-brand-dark hover:bg-neutral-100'
  }`

export default function Header() {
  const { pathname } = useLocation()
  const { cartCount } = useCart()
  const { ids } = useWishlist()
  const { t, i18n } = useTranslation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentLang = normalizeLang(
    i18n.resolvedLanguage || i18n.language
  )

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value)
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-px -mt-px z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <Container className="flex h-16 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => !sidebarOpen && setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={
              mobileOpen
                ? t('header.aria.close_menu')
                : t('header.aria.open_menu')
            }
            className="flex h-10 w-10 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark lg:hidden"
          >
            {mobileOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>

          <Link
            to="/"
            aria-label={t('header.aria.go_home')}
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <img
              src={layoutAssetsData.brand.logo}
              alt="Lumina Home"
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-haspopup="dialog"
            className="hidden h-10 items-center gap-2 rounded-md border border-neutral-200 px-4 text-sm font-medium text-brand-dark transition-all hover:bg-neutral-50 hover:border-brand-dark/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark lg:inline-flex"
          >
            <LayoutGrid size={15} aria-hidden="true" />
            {t('header.categories')}
          </button>

          <nav
            aria-label={t('header.aria.main_nav')}
            className="hidden lg:flex lg:flex-1 lg:justify-center"
          >
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <RouterNavLink
                    to={link.href}
                    end={link.href === '/'}
                    className={desktopLink}
                  >
                    {t(link.labelKey, link.defaultLabel)}
                  </RouterNavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            {/* Desktop language selector */}
            <div className="mr-2 hidden items-center lg:flex">
              <LanguageSelect
                id="desktop-lang"
                label={t('header.language')}
                value={currentLang}
                onChange={handleLanguageChange}
              />
            </div>

            <IconLink
              to="/wishlist"
              label={t('header.wishlist')}
              count={ids.length}
            >
              <Heart size={20} aria-hidden="true" />
            </IconLink>

            <IconLink
              to="/cart"
              label={t('header.cart')}
              count={cartCount}
            >
              <ShoppingBag size={20} aria-hidden="true" />
            </IconLink>

            <div className="ml-2 hidden items-center gap-2 lg:flex">
              <Link
                to="/login"
                className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-brand-dark transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              >
                {t('header.login')}
              </Link>

              <Link
                to="/register"
                className="inline-flex h-10 items-center rounded-md bg-brand-dark px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                {t('header.signup')}
              </Link>
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="fixed inset-x-0 top-16 bottom-0 z-50 h-[calc(100vh-4rem)] w-full overflow-y-auto border-t border-neutral-100 bg-white px-4 py-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden"
          >
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                setSidebarOpen(true)
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-medium text-brand-dark transition-colors hover:bg-neutral-50 active:bg-neutral-100"
            >
              <LayoutGrid size={18} aria-hidden="true" />
              {t('header.browse_categories')}
            </button>

            <nav
              aria-label={t('header.aria.mobile_nav')}
              className="mt-6"
            >
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <RouterNavLink
                      to={link.href}
                      end={link.href === '/'}
                      className={mobileLink}
                    >
                      {t(link.labelKey, link.defaultLabel)}
                    </RouterNavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile language selector */}
            <div className="mt-6 space-y-4 border-t border-neutral-100 pt-6">
              <LanguageSelect
                mobile
                id="mobile-lang"
                label={t('header.language')}
                value={currentLang}
                onChange={handleLanguageChange}
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6">
              <Link
                to="/login"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-dark text-sm font-medium text-brand-dark transition-colors hover:bg-neutral-50"
              >
                <LogIn size={16} aria-hidden="true" />
                {t('header.login')}
              </Link>

              <Link
                to="/register"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-dark text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <UserPlus size={16} aria-hidden="true" />
                {t('header.signup')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
    </>
  )
}
