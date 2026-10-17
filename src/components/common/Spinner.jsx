import { useTranslation } from 'react-i18next'

export function Spinner({ size = 20, className = '' }) {
  const { t } = useTranslation()

  return (
    <span
      role="status"
      aria-label={t('common.loading')}
      style={{ width: size, height: size }}
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  )
}