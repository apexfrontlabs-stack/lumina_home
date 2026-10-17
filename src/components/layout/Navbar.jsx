import { useTranslation } from 'react-i18next'
import NavLink from '../common/NavLink'
import { NAV_LINKS } from '../../data/navLinks'

export default function Navbar({ activePath = '/' }) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('header.aria.primary_nav')} className="hidden items-center gap-10 lg:flex">
      {NAV_LINKS.map((link) => (
        <NavLink key={link.href} href={link.href} active={activePath === link.href}>
          {t(link.labelKey, link.defaultLabel)}
        </NavLink>
      ))}
    </nav>
  )
}