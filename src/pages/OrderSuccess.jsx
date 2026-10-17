import { Link, useLocation } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Container } from '../components/common/Container'
import { money } from '../utils/helper'

export default function OrderSuccess() {
  const { t } = useTranslation()
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <main className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
              {t('success.none_title')}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
              {t('success.none_text')}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="w-full rounded-md bg-brand-dark px-6 py-3 text-sm font-medium text-white hover:opacity-90 sm:w-auto"
              >
                {t('booking.continue_shopping')}
              </Link>
              <Link
                to="/order-tracking"
                className="text-sm font-medium text-brand-dark underline underline-offset-4"
              >
                {t('success.track_an_order')}
              </Link>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  const { address = {}, items = [] } = order

  return (
    <main className="bg-white py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div role="status" className="text-center">
            <CheckCircle2
              className="mx-auto text-green-600"
              size={48}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-4 font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
              {t('success.title')}
            </h1>
            <p className="mt-3 break-words text-sm leading-relaxed text-brand-gray sm:text-base">
              <Trans
                i18nKey="success.text"
                values={{ id: order.id, email: order.email }}
                components={{
                  id: <span className="font-medium text-brand-dark" />,
                  email: <span className="font-medium text-brand-dark" />,
                }}
              />
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-xs text-brand-gray">{t('success.estimated_delivery')}</p>
              <p className="mt-1 text-sm font-medium text-brand-dark">{order.estimatedDelivery}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-xs text-brand-gray">{t('success.payment')}</p>
              <p className="mt-1 text-sm font-medium text-brand-dark">{order.paymentMethod}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-xs text-brand-gray">{t('success.deliver_to')}</p>
              <p className="mt-1 break-words text-sm font-medium text-brand-dark">
                {address.name}
                {address.line1 && <>, {address.line1}</>}
                {address.city && <>, {address.city}</>}
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-lg border border-neutral-200">
            <h2 className="border-b border-neutral-200 px-5 py-4 font-serif text-lg tracking-wide text-brand-dark">
              {t('cart.summary')}
            </h2>
            <ul className="divide-y divide-neutral-200 px-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-4 text-sm">
                  <div className="min-w-0">
                    {/* nameKey se naam, taake zuban badalne par yahan bhi badle */}
                    <p className="font-medium text-brand-dark">
                      {item.nameKey ? t(item.nameKey, { defaultValue: item.name }) : item.name}
                    </p>
                    <p className="text-brand-gray">{t('dashboard.orders.qty', { quantity: item.quantity })}</p>
                  </div>
                  <p className="whitespace-nowrap font-medium text-brand-dark">
                    {money(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-neutral-200 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('cart.subtotal')}</dt>
                <dd className="text-brand-dark">{money(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('success.shipping')}</dt>
                <dd className="text-brand-dark">{order.shipping ? money(order.shipping) : t('cart.free')}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                <dt className="text-brand-dark">{t('cart.total')}</dt>
                <dd className="text-brand-dark">{money(order.total)}</dd>
              </div>
            </dl>
          </section>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/order-tracking"
              state={{ orderId: order.id, email: order.email }}
              className="w-full rounded-md bg-brand-dark px-6 py-3 text-center text-sm font-medium text-white hover:opacity-90 sm:w-auto"
            >
              {t('dashboard.orders.track')}
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium text-brand-dark underline underline-offset-4"
            >
              {t('booking.continue_shopping')}
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}