import { useTranslation } from 'react-i18next'
import { Minus, Plus } from 'lucide-react'

export function QuantitySelector({ value, onChange, min = 1, max = 99, className = '' }) {
  const { t } = useTranslation()
  const btn =
    'flex h-10 w-10 items-center justify-center text-brand-dark transition-colors hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent'

  return (
    <div className={`inline-flex items-center border border-neutral-300 font-sans ${className}`}>
      <button type="button" aria-label={t('common.decrease_quantity')} className={btn} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm" aria-live="polite">{value}</span>
      <button type="button" aria-label={t('common.increase_quantity')} className={btn} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus size={14} />
      </button>
    </div>
  )
}