
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { Input } from '../../components/common/Input'
import Button from '../../components/common/Button'
import PaymentMethods from '../../components/payment/PaymentMethod'
import { useCart } from '../../context/CartContext'
import { productImage, money, calcShipping } from '../../utils/helper'
import { productName } from '../../utils/i18nHelper'
import { SITE } from '@/config/siteInfo'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PAYMENT_OPTIONS = [
  {
    key: 'cod',
    labelKey: 'checkout.payment.cod_label',
    textKey: 'checkout.payment.cod_text',
  },
  {
    key: 'bank',
    labelKey: 'checkout.payment.bank_label',
    textKey: 'checkout.payment.bank_text',
  },
  {
    key: 'card',
    labelKey: 'payment.tab',
    textKey: 'payment.subtitle',
  },
]

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
  payment: 'cod',
}

const linkClass = 'underline underline-offset-4'

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, cartSubtotal, clearCart } = useCart()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const shipping = calcShipping(cartSubtotal)
  const total = cartSubtotal + shipping

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = () => {
    const next = {}

    if (!form.name.trim()) {
      next.name = 'auth.errors.name_required'
    }

    if (!form.email.trim()) {
      next.email = 'auth.errors.email_required'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = 'auth.errors.email_invalid'
    }

    if (!form.phone.trim()) {
      next.phone = 'checkout.errors.phone_required'
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      next.phone = 'checkout.errors.phone_invalid'
    }

    if (!form.address.trim()) {
      next.address = 'checkout.errors.address_required'
    }

    if (!form.city.trim()) {
      next.city = 'checkout.errors.city_required'
    }

    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const next = validate()
    setErrors(next)

    if (Object.keys(next).length > 0) {
      document
        .getElementById('checkout-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const payment = PAYMENT_OPTIONS.find(
      (option) => option.key === form.payment
    )

    const order = {
      id: `LUM-${Date.now().toString().slice(-6)}`,
      email: form.email.trim(),
      paymentMethod: t(payment.labelKey),
      paymentType: form.payment,
      notes: form.notes.trim(),
      estimatedDelivery: t('checkout.estimated_delivery'),
      address: {
        name: form.name.trim(),
        line1: form.address.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
      },
      items: cart.map((item) => ({
        id: item.id,
        name: productName(t, item),
        nameKey: item.nameKey,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: cartSubtotal,
      shipping,
      total,
    }

    clearCart()
    navigate('/order-success', { state: { order } })
  }

  if (cart.length === 0) {
    return (
      <main className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
              {t('checkout.empty_title')}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
              {t('checkout.empty_text')}
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-brand-dark px-8 text-sm font-medium text-white hover:opacity-90"
            >
              {t('cart.browse_shop')}
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: t('header.nav.home'), href: '/' },
            { label: t('header.cart'), href: '/cart' },
            { label: t('checkout.title') },
          ]}
        />

        <h1 className="mt-6 font-serif text-3xl font-light tracking-wide text-brand-dark sm:mt-8 sm:text-4xl">
          {t('checkout.title')}
        </h1>

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-12"
        >
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-lg border border-neutral-200 p-5 sm:p-8">
              <h2 className="font-serif text-xl tracking-wide text-brand-dark">
                {t('checkout.delivery_details')}
              </h2>

              <div className="mt-5 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label={t('auth.register.full_name')}
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder={t('auth.register.full_name_placeholder')}
                    error={errors.name ? t(errors.name) : undefined}
                  />

                  <Input
                    label={t('auth.email_label')}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder={t('auth.email_placeholder')}
                    error={errors.email ? t(errors.email) : undefined}
                  />
                </div>

                <Input
                  label={t('dashboard.profile.phone')}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder={SITE.phone}
                  error={errors.phone ? t(errors.phone) : undefined}
                />

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <Input
                      label={t('checkout.delivery_address')}
                      type="text"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={update('address')}
                      placeholder={t('booking.address_placeholder')}
                      error={errors.address ? t(errors.address) : undefined}
                    />
                  </div>

                  <Input
                    label={t('dashboard.profile.city')}
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={update('city')}
                    placeholder={t('dashboard.profile.city')}
                    error={errors.city ? t(errors.city) : undefined}
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="mb-1.5 block text-sm font-medium text-brand-dark"
                  >
                    {t('checkout.notes_label')}
                  </label>

                  <textarea
                    id="checkout-notes"
                    rows={3}
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder={t('checkout.notes_placeholder')}
                    className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-neutral-400 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-neutral-200 p-5 sm:p-8">
              <h2 className="font-serif text-xl tracking-wide text-brand-dark">
                {t('checkout.payment.title')}
              </h2>

              <div
                role="radiogroup"
                aria-label={t('checkout.payment.method')}
                className="mt-5 space-y-3"
              >
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.key}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                      form.payment === option.key
                        ? 'border-brand-dark bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.key}
                      checked={form.payment === option.key}
                      onChange={update('payment')}
                      className="mt-1 h-4 w-4 accent-neutral-950"
                    />

                    <span>
                      <span className="block text-sm font-medium text-brand-dark">
                        {t(option.labelKey)}
                      </span>

                      <span className="mt-0.5 block text-sm text-brand-gray">
                        {t(option.textKey)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              {form.payment === 'card' && (
                <div className="mt-6 border-t border-neutral-200 pt-6">
                  <PaymentMethods />
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-neutral-200 bg-neutral-50 p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="font-serif text-xl tracking-wide text-brand-dark">
              {t('checkout.your_order')}
            </h2>

            <ul className="mt-4 divide-y divide-neutral-200">
              {cart.map((item) => {
                const name = productName(t, item)

                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <img
                      src={item.image ?? productImage(item)}
                      alt={name}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-md bg-stone-100 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-brand-dark">
                        {name}
                      </p>

                      <p className="text-xs text-brand-gray">
                        {t('dashboard.orders.qty', {
                          quantity: item.quantity,
                        })}
                      </p>
                    </div>

                    <p className="whitespace-nowrap text-sm font-medium text-brand-dark">
                      {money(item.price * item.quantity)}
                    </p>
                  </li>
                )
              })}
            </ul>

            <dl className="mt-4 space-y-3 border-t border-neutral-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('cart.subtotal')}</dt>
                <dd className="text-brand-dark">{money(cartSubtotal)}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('cart.delivery')}</dt>
                <dd className="text-brand-dark">
                  {shipping ? money(shipping) : t('cart.free')}
                </dd>
              </div>

              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                <dt className="text-brand-dark">{t('cart.total')}</dt>
                <dd className="text-brand-dark">{money(total)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Button
                type="submit"
                fullWidth={true}
                variant="primary"
                size="md"
              >
                {t('checkout.place_order')}
              </Button>
            </div>

            <p className="mt-3 text-center text-xs text-brand-gray">
              <Trans
                i18nKey="checkout.agreement"
                components={{
                  terms: <Link to="/terms" className={linkClass} />,
                  returns: (
                    <Link to="/shipping-returns" className={linkClass} />
                  ),
                }}
              />
            </p>
          </aside>
        </form>
      </Container>
    </main>
  )
}
