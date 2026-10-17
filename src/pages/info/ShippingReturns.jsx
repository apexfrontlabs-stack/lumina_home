import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { InfoLayout, InfoSection } from '../../components/layout/InfoLayout'
import { SITE, formatMonthYear } from '@/config/siteInfo'

const linkClass = 'text-brand-dark underline underline-offset-4 hover:opacity-80'

export default function ShippingReturns() {
  const { t, i18n } = useTranslation()

  const deliveryRows = [
    { area: t('shipping.areas.major', { cities: SITE.majorCities }), time: t('shipping.times.major') },
    { area: t('shipping.areas.other'), time: t('shipping.times.other') },
    { area: t('shipping.areas.made_to_order'), time: t('shipping.times.made_to_order') },
  ]

  return (
    <InfoLayout
      title={t('shipping.title')}
      intro={t('shipping.intro')}
      updated={formatMonthYear(i18n.language)}
    >
      <InfoSection title={t('shipping.delivery.title')}>
        <p>{t('shipping.delivery.text')}</p>

        {/* Chhoti screen par table andar hi scroll karta hai */}
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="bg-neutral-50 text-brand-dark">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">{t('shipping.delivery.col_area')}</th>
                <th scope="col" className="px-4 py-3 font-medium">{t('shipping.delivery.col_time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {deliveryRows.map((row) => (
                <tr key={row.area}>
                  <td className="px-4 py-3">{row.area}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoSection>

      <InfoSection title={t('shipping.charges.title')}>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('shipping.charges.free', { amount: SITE.freeShippingOver })}</li>
          <li>{t('shipping.charges.flat', { fee: SITE.standardFee })}</li>
          <li>{t('shipping.charges.shown')}</li>
        </ul>
      </InfoSection>

      <InfoSection title={t('shipping.setup.title')}>
        <p>{t('shipping.setup.p1')}</p>
        <p>{t('shipping.setup.p2')}</p>
      </InfoSection>

      <InfoSection title={t('shipping.payment.title')}>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('shipping.payment.cod')}</li>
          <li>{t('shipping.payment.online')}</li>
        </ul>
      </InfoSection>

      <InfoSection title={t('shipping.returns.title', { days: SITE.returnDays })}>
        <p>{t('shipping.returns.text', { days: SITE.returnDays })}</p>
        <p>{t('shipping.returns.not_returnable')}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t('shipping.returns.item1')}</li>
          <li>{t('shipping.returns.item2')}</li>
          <li>{t('shipping.returns.item3')}</li>
        </ul>
      </InfoSection>

      <InfoSection title={t('shipping.damaged.title')}>
        <p>{t('shipping.damaged.text')}</p>
      </InfoSection>

      <InfoSection title={t('shipping.how_to.title')}>
        <ol className="list-decimal space-y-2 pl-5">
          <li>{t('shipping.how_to.step1', { email: SITE.email, phone: SITE.phone })}</li>
          <li>{t('shipping.how_to.step2')}</li>
          <li>{t('shipping.how_to.step3')}</li>
        </ol>
      </InfoSection>

      <InfoSection title={t('shipping.question.title')}>
        <p>
          <Trans
            i18nKey="shipping.question.text"
            components={{
              faq: <Link to="/faq" className={linkClass} />,
              contact: <Link to="/contact" className={linkClass} />,
            }}
          />
        </p>
      </InfoSection>
    </InfoLayout>
  )
}