import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Container } from '../components/common/Container'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Input } from '../components/common/Input'
import  Button  from '../components/common/Button'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STEPS = ['placed', 'confirmed', 'dispatched', 'out', 'delivered']


async function lookupOrder({ orderId, email }) {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return {
    id: orderId,
    email,
    status: 'dispatched',
    estimatedDeliveryKey: 'tracking.demo_delivery',
  }
}

export default function OrderTracking() {
  const { t } = useTranslation()
  const { state } = useLocation()
  const [orderId, setOrderId] = useState(state?.orderId ?? '')
  const [email, setEmail] = useState(state?.email ?? '')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const validate = () => {
    const next = {}
    if (!orderId.trim()) next.orderId = 'tracking.errors.order_required'
    if (!email.trim()) next.email = 'auth.errors.email_required'
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'auth.errors.email_invalid'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    setNotFound(false)
    setOrder(null)
    try {
      const result = await lookupOrder({ orderId: orderId.trim(), email: email.trim() })
      if (result) setOrder(result)
      else setNotFound(true)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const currentIndex = order ? STEPS.indexOf(order.status) : -1

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs
          items={[{ label: t('header.nav.home'), href: '/' }, { label: t('tracking.breadcrumb') }]}
        />

        <div className="mx-auto mt-8 max-w-2xl">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {t('tracking.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
            {t('tracking.intro')}
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-5 rounded-lg border border-neutral-200 p-5 sm:p-8"
          >
            <Input
              label={t('tracking.order_number')}
              type="text"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value)
                if (errors.orderId) setErrors((p) => ({ ...p, orderId: undefined }))
              }}
              placeholder={t('tracking.order_placeholder')}
              error={errors.orderId ? t(errors.orderId) : undefined}
            />
            <Input
              label={t('auth.email_label')}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
              }}
              placeholder={t('auth.email_placeholder')}
              error={errors.email ? t(errors.email) : undefined}
            />
            <Button type="submit" fullWidth={true} variant="primary" size="md" disabled={loading}>
              {loading ? t('tracking.checking') : t('tracking.submit')}
            </Button>
          </form>

          <div aria-live="polite">
            {notFound && (
              <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {t('tracking.not_found')}
              </p>
            )}

            {order && (
              <section className="mt-8 rounded-lg border border-neutral-200 p-5 sm:p-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="break-words font-serif text-xl tracking-wide text-brand-dark">
                    {t('dashboard.orders.order_id', { id: order.id })}
                  </h2>
                  <p className="text-sm text-brand-gray">
                    {t('tracking.estimated', { time: t(order.estimatedDeliveryKey) })}
                  </p>
                </div>

                <ol className="mt-6">
                  {STEPS.map((key, index) => {
                    const done = index <= currentIndex
                    const isCurrent = index === currentIndex
                    const isLast = index === STEPS.length - 1

                    return (
                      <li key={key} className="relative flex gap-4 pb-8 last:pb-0">
                        {!isLast && (
                          <span
                            aria-hidden="true"
                            className={`absolute left-4 top-8 h-full w-px -translate-x-1/2 ${
                              index < currentIndex ? 'bg-brand-dark' : 'bg-neutral-200'
                            }`}
                          />
                        )}
                        <span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${
                            done
                              ? 'border-brand-dark bg-brand-dark text-white'
                              : 'border-neutral-300 bg-white text-neutral-400'
                          }`}
                        >
                          {done ? <Check size={14} aria-hidden="true" /> : index + 1}
                        </span>
                        <div className="min-w-0 pt-1">
                          <p
                            aria-current={isCurrent ? 'step' : undefined}
                            className={`text-sm font-medium sm:text-base ${
                              done ? 'text-brand-dark' : 'text-brand-gray'
                            }`}
                          >
                            {t(`tracking.steps.${key}.label`)}
                            {isCurrent && (
                              <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-normal text-brand-dark">
                                {t('tracking.current')}
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-sm text-brand-gray">{t(`tracking.steps.${key}.text`)}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}