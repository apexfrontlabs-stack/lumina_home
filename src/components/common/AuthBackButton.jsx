import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

export default function AuthBackButton() {
  const navigate = useNavigate()
  const { key } = useLocation()
  const { t } = useTranslation() 

  const canGoBack = key !== 'default'

  const handleClick = (e) => {
    if (canGoBack) {
      e.preventDefault()
      navigate(-1) 
    }
  }

  return (
    <Link
      to="/"
      onClick={handleClick}
      aria-label={canGoBack ? t('common.go_back') : t('common.back_to_home')} // 👈 Dynamic Key mapping
      className="absolute left-4 top-4 z-10 inline-flex h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-medium text-brand-dark shadow-sm backdrop-blur transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:left-6 sm:top-6"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {canGoBack ? t('common.back') : t('common.home')} {/* 👈 Dynamic Key mapping */}
    </Link>
  )
}
