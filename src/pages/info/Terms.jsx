import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { InfoLayout, InfoSection } from '../../components/layout/InfoLayout'
import { SITE, formatMonthYear } from '@/config/siteInfo'

const list = 'list-disc space-y-2 pl-5'
const linkClass = 'text-brand-dark underline underline-offset-4 hover:opacity-80'

export default function Terms() {
  const { t, i18n } = useTranslation()

  return (
    <InfoLayout
      title={t('terms.title')}
      intro={t('terms.intro', { store: SITE.name })}
      updated={formatMonthYear(i18n.language)}
    >
      <InfoSection title={t('terms.using.title')}>
        <p>{t('terms.using.text')}</p>
      </InfoSection>

      <InfoSection title={t('terms.products.title')}>
        <ul className={list}>
          <li>{t('terms.products.item1')}</li>
          <li>{t('terms.products.item2')}</li>
          <li>{t('terms.products.item3')}</li>
        </ul>
      </InfoSection>

      <InfoSection title={t('terms.orders.title')}>
        <p>{t('terms.orders.text')}</p>
      </InfoSection>

      <InfoSection title={t('terms.delivery.title')}>
        <p>
          <Trans
            i18nKey="terms.delivery.text"
            components={{ shipping: <Link to="/shipping-returns" className={linkClass} /> }}
          />
        </p>
      </InfoSection>

      <InfoSection title={t('terms.warranty.title')}>
        <p>{t('terms.warranty.text')}</p>
      </InfoSection>

      <InfoSection title={t('terms.ip.title')}>
        <p>{t('terms.ip.text', { store: SITE.name })}</p>
      </InfoSection>

      <InfoSection title={t('terms.liability.title')}>
        <p>{t('terms.liability.text', { store: SITE.name })}</p>
      </InfoSection>

      <InfoSection title={t('terms.changes.title')}>
        <p>{t('terms.changes.text')}</p>
      </InfoSection>

      <InfoSection title={t('terms.law.title')}>
        <p>{t('terms.law.text', { country: SITE.country })}</p>
      </InfoSection>

      <InfoSection title={t('terms.contact.title')}>
        <p>
          <Trans
            i18nKey="terms.contact.text"
            values={{ email: SITE.email }}
            components={{ contact: <Link to="/contact" className={linkClass} /> }}
          />
        </p>
      </InfoSection>
    </InfoLayout>
  )
}