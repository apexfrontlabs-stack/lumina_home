import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items, className = '', ...rest }) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('common.breadcrumb')} className={className} {...rest}>
      <ol className="flex flex-wrap items-center gap-2 font-sans text-xs uppercase tracking-widest text-brand-gray">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href ?? item.label} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-brand-dark">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.href}
                    className="transition-colors hover:text-brand-dark"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight size={12} aria-hidden="true" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}