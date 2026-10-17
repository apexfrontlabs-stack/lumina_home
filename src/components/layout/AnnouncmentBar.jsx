import { useTranslation } from 'react-i18next'
import { money, FREE_SHIPPING_OVER } from '../../utils/helper'

export function AnnouncementBar({ children }) {
  const { t } = useTranslation()

  let content
  if (children == null) {
    content = t('announcement.free_shipping', { amount: money(FREE_SHIPPING_OVER) })
  } else if (typeof children === 'string') {
    content = t(children, { defaultValue: children })
  } else {
    content = children
  }

  return (
    <div className="bg-brand-dark px-4 py-2 text-center font-sans text-[11px] uppercase tracking-widest text-white">
      {content}
    </div>
  )
}