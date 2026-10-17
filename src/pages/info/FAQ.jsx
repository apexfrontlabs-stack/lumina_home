import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { InfoLayout, InfoSection } from '../../components/layout/InfoLayout'
import { Accordion } from '../../components/common/Accordion'
import { SITE } from '@/config/siteInfo'

const FAQ_GROUPS = [
  { id: 'orders', items: ['place_order', 'payment', 'change_cancel'] },
  { id: 'delivery', items: ['how_long', 'assembly', 'tracking'] },
  { id: 'returns', items: ['return_policy', 'damaged', 'warranty'] },
  { id: 'products', items: ['colour', 'care'] },
]

const linkClass = 'text-brand-dark underline underline-offset-4 hover:opacity-80'

export default function FAQ() {
  const { t } = useTranslation()

  return (
    <InfoLayout title={t('faq.title')} intro={t('faq.intro')}>
      {FAQ_GROUPS.map((group) => (
        <InfoSection key={group.id} title={t(`faq.groups.${group.id}.heading`)}>
          <Accordion
            items={group.items.map((item) => ({
              title: t(`faq.groups.${group.id}.${item}.title`),
              // {{days}} un jawabon mein kaam aata hai jahan din likhe hon
              content: t(`faq.groups.${group.id}.${item}.content`, { days: SITE.returnDays }),
            }))}
          />
        </InfoSection>
      ))}

      <InfoSection title={t('faq.more_title')}>
        <p>
          <Trans
            i18nKey="faq.more_text"
            components={{
              shipping: <Link to="/shipping-returns" className={linkClass} />,
              contact: <Link to="/contact" className={linkClass} />,
            }}
          />
        </p>
      </InfoSection>
    </InfoLayout>
  )
}