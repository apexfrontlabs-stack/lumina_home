import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, LayoutGrid, LogIn, Menu, ShoppingBag, UserPlus, X, Globe } from 'lucide-react'
import { Container } from '../common/Container'
import { layoutAssetsData } from '../../data/layoutData' 
import { LANGUAGES } from '../../data/navLinks'
import { NAV_LINKS } from '../../data/navLinks'
import { useCart } from '../../context/CartContext'
import useWishlist from '../../hooks/useWishlist'
import Sidebar from './Sidebar'

function IconLink({ to, label, count, children }) {
  const { t } = useTranslation()

  return (
    <Link
      to={to}
      aria-label={count ? t('header.aria.icon_with_count', { label, total: count }) : label}
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

const desktopLink = ({ isActive }) =>
  `text-sm tracking-wide transition-all duration-200 hover:text-brand-dark relative py-2 ${
    isActive
      ? 'font-medium text-brand-dark after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-brand-dark after:rounded-full'
      : 'text-brand-gray/90'
  }`

const mobileLink = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-base transition-all duration-200 ${
    isActive ? 'bg-neutral-900 font-medium text-white' : 'text-brand-dark hover:bg-neutral-100'
  }`

export default function Header() {
  const { pathname } = useLocation()
  const { cartCount } = useCart()
  const { ids } = useWishlist()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t, i18n } = useTranslation() // 🛠️ i18n add kiya

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value) // 🛠️ Language change trigger
  }

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])
  return (
    <>
      <header className="sticky top-px -mt-px z-40 w-full block border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <Container className="flex h-16 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => !sidebarOpen && setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t('header.aria.close_menu') : t('header.aria.open_menu')}
            className="flex h-10 w-10 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark lg:hidden"
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          <Link to="/" aria-label={t('header.aria.go_home')} className="shrink-0 transition-opacity hover:opacity-90">
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
            <LayoutGrid size={15} aria-hidden="true" /> {t('header.categories')}
          </button>

          <nav aria-label={t('header.aria.main_nav')} className="hidden lg:flex lg:flex-1 lg:justify-center">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <RouterNavLink to={link.href} end={link.href === '/'} className={desktopLink}>
                    {t(link.labelKey, link.defaultLabel)}
                  </RouterNavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            
            {/* 🛠️ DESKTOP LANGUAGE DROPDOWN */}
            <div className="mr-2 hidden items-center gap-1.5 rounded-md border border-neutral-200 px-2 h-10 text-brand-dark bg-white/50 focus-within:ring-2 focus-within:ring-brand-dark lg:flex">
              <Globe size={15} className="text-neutral-400" />
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                aria-label={t('header.language')}
                className="cursor-pointer bg-transparent text-xs font-medium focus:outline-none pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <IconLink to="/wishlist" label={t('header.wishlist')} count={ids.length}>
              <Heart size={20} aria-hidden="true" />
            </IconLink>
            <IconLink to="/cart" label={t('header.cart')} count={cartCount}>
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
            className="fixed inset-x-0 top-16 bottom-0 z-50 h-[calc(100vh-4rem)] w-full overflow-y-auto bg-white border-t border-neutral-100 px-4 py-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden"
          >
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                setSidebarOpen(true)
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-medium text-brand-dark transition-colors hover:bg-neutral-50 active:bg-neutral-100"
            >
              <LayoutGrid size={18} aria-hidden="true" /> {t('header.browse_categories')}
            </button>

            <nav aria-label={t('header.aria.mobile_nav')} className="mt-6">
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <RouterNavLink to={link.href} end={link.href === '/'} className={mobileLink}>
                      {t(link.labelKey, link.defaultLabel)}
                    </RouterNavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 🛠️ MOBILE LANGUAGE DROPDOWN */}
            <div className="mt-6 border-t border-neutral-100 pt-6">
              <label htmlFor="mobile-lang" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                {t('header.language')}
              </label>
              <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-neutral-200 px-4 bg-neutral-50/50 focus-within:ring-2 focus-within:ring-brand-dark">
                <Globe size={18} className="text-neutral-500" />
                <select
                  id="mobile-lang"
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  className="w-full cursor-pointer bg-transparent text-sm font-medium text-brand-dark focus:outline-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6">
              <Link
                to="/login"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-dark text-sm font-medium text-brand-dark transition-colors hover:bg-neutral-50"
              >
                <LogIn size={16} aria-hidden="true" /> {t('header.login')}
              </Link>
              <Link
                to="/register"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-dark text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <UserPlus size={16} aria-hidden="true" /> {t('header.signup')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
    </>
  )
}
