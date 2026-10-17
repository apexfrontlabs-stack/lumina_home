import { useTranslation } from 'react-i18next'
import { themeConfig } from '@/config/themeConfig'

const VARIANTS = {
  new: 'bg-brand-dark text-white',
  sale: 'bg-brand-gold text-brand-dark',
  bestseller: 'bg-white text-brand-dark border border-brand-dark',
  limited: 'bg-white text-brand-dark border border-brand-gold',
  soldout: 'bg-neutral-200 text-neutral-700',
}

export function Badge({ variant = 'new', className = '', children, ...rest }) {
  const { t } = useTranslation()

  return (
    <span
      className={`inline-block whitespace-nowrap select-none font-sans text-[11px] font-medium uppercase leading-none tracking-widest px-3 py-1.5 ${VARIANTS[variant] ?? VARIANTS.new} ${className}`}
      {...rest}
    >
      {children ?? t(`badge.${variant}`, themeConfig.labels.badge[variant])}
    </span>
  )
}