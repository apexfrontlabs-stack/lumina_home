import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'

export function RatingStars({
  rating = 0,
  max = 5,
  size = 14,
  showValue = false,
  count,
  className = '',
  ...rest
}) {
  const { t } = useTranslation()

  return (
    <div className={`inline-flex items-center gap-2 font-sans ${className}`} {...rest}>
      <div
        className="flex gap-0.5"
        role="img"
        aria-label={t('common.rated', { rating, max })}
      >
        {Array.from({ length: max }, (_, i) => {
          // 0 se 100 tak: is star ka kitna hissa gold hona chahiye
          const fill = Math.min(Math.max(rating - i, 0), 1) * 100

          return (
            <span
              key={i}
              className="relative inline-block"
              style={{ width: size, height: size }}
            >
              <Star
                size={size}
                fill="currentColor"
                strokeWidth={0}
                className="absolute inset-0 text-neutral-300"
                aria-hidden="true"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill}%` }}
              >
                <Star
                  size={size}
                  fill="currentColor"
                  strokeWidth={0}
                  className="text-brand-gold"
                  aria-hidden="true"
                />
              </span>
            </span>
          )
        })}
      </div>

      {showValue && (
        <span className="text-xs font-medium text-brand-dark">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-brand-gray">({count})</span>
      )}
    </div>
  )
}