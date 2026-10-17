import { useTranslation } from 'react-i18next'

export function ColorSwatch({ colors = [], value, onChange, className = '' }) {
  const { t } = useTranslation()

  return (
    <div role="radiogroup" aria-label={t('common.color')} className={`flex gap-2 ${className}`}>
      {colors.map((c) => (
        <button
          key={c.name}
          type="button"
          role="radio"
          aria-checked={value === c.name}
          aria-label={c.name}
          title={c.name}
          onClick={() => onChange?.(c.name)}
          className={`h-7 w-7 rounded-full border border-neutral-300 outline-offset-2 transition ${
            value === c.name ? 'outline outline-2 outline-brand-dark' : ''
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  )
}