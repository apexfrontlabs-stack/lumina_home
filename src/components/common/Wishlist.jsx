import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'

export function WishlistButton({ active, onToggle, className = '' }) {
  const [internal, setInternal] = useState(false)
  const { t } = useTranslation()
  const isActive = active ?? internal

  const handleClick = (e) => {
    e.preventDefault()
    if (active === undefined) setInternal(!internal)
    onToggle?.(!isActive)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      aria-label={isActive ? t('common.remove_from_wishlist') : t('common.add_to_wishlist')}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition-colors hover:bg-neutral-100 ${className}`}
    >
      <Heart size={16} className={isActive ? 'fill-brand-dark' : ''} />
    </button>
  )
}