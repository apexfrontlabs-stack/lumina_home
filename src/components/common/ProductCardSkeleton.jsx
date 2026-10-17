import { useTranslation } from 'react-i18next'
import { Skeleton } from './Skeleton'

export function ProductCardSkeleton({ className = '' }) {
  const { t } = useTranslation()

  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label={t('common.loading_product')}>
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}