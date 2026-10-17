import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, totalPages, onChange, className = '' }) {
  const { t } = useTranslation()
  const base = 'flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-colors'

  return (
    <nav aria-label={t('common.pagination')} className={`flex items-center justify-center gap-2 font-sans ${className}`}>
      <button type="button" aria-label={t('common.previous_page')} disabled={page <= 1} onClick={() => onChange(page - 1)}
        className={`${base} border-neutral-300 hover:border-brand-dark disabled:opacity-40`}>
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined}
          className={`${base} ${n === page ? 'border-brand-dark bg-brand-dark text-white' : 'border-neutral-300 hover:border-brand-dark'}`}>
          {n}
        </button>
      ))}
      <button type="button" aria-label={t('common.next_page')} disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        className={`${base} border-neutral-300 hover:border-brand-dark disabled:opacity-40`}>
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}