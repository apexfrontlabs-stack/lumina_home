import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Package, Heart, User, LogOut } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { productsData } from '../../data/productData'
import { productImage, money } from '../../utils/helper'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEMO_USER = {
  name: 'Ayesha Khan',
  email: 'ayesha@example.com',
  phone: '+92 300 1234567',
  address: 'House 12, Street 4',
  city: 'Lahore',
}

// Dates ISO format mein hain, taake har zuban ke hisaab se format ho sakein
const DEMO_ORDERS = [
  { id: 'LUM-20481', date: '2026-10-02', status: 'dispatched', items: [{ productId: 'lum-003', quantity: 1 }] },
  { id: 'LUM-20310', date: '2026-09-14', status: 'delivered', items: [{ productId: 'lum-012', quantity: 2 }, { productId: 'lum-020', quantity: 1 }] },
  { id: 'LUM-20122', date: '2026-08-21', status: 'delivered', items: [{ productId: 'lum-007', quantity: 4 }] },
]

const STATUS = {
  placed: { labelKey: 'dashboard.status.placed', cls: 'bg-neutral-100 text-brand-dark' },
  dispatched: { labelKey: 'dashboard.status.dispatched', cls: 'bg-blue-50 text-blue-700' },
  delivered: { labelKey: 'dashboard.status.delivered', cls: 'bg-green-50 text-green-700' },
}

const TABS = [
  { key: 'overview', labelKey: 'dashboard.tabs.overview', icon: LayoutDashboard },
  { key: 'orders', labelKey: 'dashboard.tabs.orders', icon: Package },
  { key: 'wishlist', labelKey: 'dashboard.tabs.wishlist', icon: Heart },
  { key: 'profile', labelKey: 'dashboard.tabs.profile', icon: User },
]

const orderLines = (order) =>
  order.items
    .map((it) => ({ ...it, product: productsData.find((p) => p.id === it.productId) }))
    .filter((it) => it.product)

const orderTotal = (order) =>
  orderLines(order).reduce((sum, it) => sum + it.product.price * it.quantity, 0)

const formatDate = (iso, lang) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

function readWishlistIds() {
  try {
    const ids = JSON.parse(localStorage.getItem('lumina_wishlist') || '[]')
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

/* ---------- Pieces ---------- */

function StatusBadge({ status }) {
  const { t } = useTranslation()
  const s = STATUS[status] ?? STATUS.placed
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>{t(s.labelKey)}</span>
}

function OrdersList({ orders }) {
  const { t, i18n } = useTranslation()

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-base font-medium text-brand-dark">{t('dashboard.orders.empty_title')}</p>
        <p className="mt-1 text-sm text-brand-gray">{t('dashboard.orders.empty_text')}</p>
        <Link to="/shop" className="mt-4 inline-block text-sm font-medium text-brand-dark underline underline-offset-4">
          {t('dashboard.orders.start_shopping')}
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id} className="rounded-lg border border-neutral-200">
          <div className="flex flex-col gap-2 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-brand-dark">{t('dashboard.orders.order_id', { id: order.id })}</p>
              <p className="text-xs text-brand-gray">{formatDate(order.date, i18n.language)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <p className="text-sm font-semibold text-brand-dark">{money(orderTotal(order))}</p>
            </div>
          </div>

          <ul className="divide-y divide-neutral-100 px-4">
            {orderLines(order).map(({ product, quantity }) => {
              const productName = t(product.nameKey, { defaultValue: product.id })
              return (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <img
                    src={productImage(product)}
                    alt={productName}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-md bg-stone-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brand-dark">{productName}</p>
                    <p className="text-xs text-brand-gray">{t('dashboard.orders.qty', { quantity })}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="border-t border-neutral-200 p-4">
            <Link
              to="/order-tracking"
              state={{ orderId: order.id, email: DEMO_USER.email }}
              className="text-sm font-medium text-brand-dark underline underline-offset-4 hover:opacity-80"
            >
              {t('dashboard.orders.track')}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

function WishlistTab() {
  const { t } = useTranslation()
  const [ids] = useState(readWishlistIds)
  const items = ids.map((id) => productsData.find((p) => p.id === id)).filter(Boolean)

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-base font-medium text-brand-dark">{t('dashboard.wishlist.empty_title')}</p>
        <p className="mt-1 text-sm text-brand-gray">{t('dashboard.wishlist.empty_text')}</p>
        <Link to="/shop" className="mt-4 inline-block text-sm font-medium text-brand-dark underline underline-offset-4">
          {t('dashboard.wishlist.browse_shop')}
        </Link>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">
      {items.map((product) => {
        const productName = t(product.nameKey, { defaultValue: product.id })
        return (
          <li key={product.id}>
            <Link to={`/product/${product.id}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
                <img
                  src={productImage(product)}
                  alt={productName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-medium text-brand-dark group-hover:underline">{productName}</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">{money(product.price)}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function ProfileTab() {
  const { t } = useTranslation()
  const [form, setForm] = useState(DEMO_USER)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'auth.errors.name_required'
    if (!form.email.trim()) next.email = 'auth.errors.email_required'
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'auth.errors.email_invalid'
    if (!form.phone.trim()) next.phone = 'dashboard.profile.errors.phone_required'
    if (!form.address.trim()) next.address = 'dashboard.profile.errors.address_required'
    if (!form.city.trim()) next.city = 'dashboard.profile.errors.city_required'
    setErrors(next)
    if (Object.keys(next).length === 0) setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5 rounded-lg border border-neutral-200 p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={t('auth.register.full_name')} type="text" autoComplete="name" value={form.name} onChange={update('name')} error={errors.name ? t(errors.name) : undefined} />
        <Input label={t('auth.email_label')} type="email" autoComplete="email" inputMode="email" value={form.email} onChange={update('email')} error={errors.email ? t(errors.email) : undefined} />
      </div>
      <Input label={t('dashboard.profile.phone')} type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={update('phone')} error={errors.phone ? t(errors.phone) : undefined} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={t('dashboard.profile.address')} type="text" autoComplete="street-address" value={form.address} onChange={update('address')} error={errors.address ? t(errors.address) : undefined} />
        <Input label={t('dashboard.profile.city')} type="text" autoComplete="address-level2" value={form.city} onChange={update('city')} error={errors.city ? t(errors.city) : undefined} />
      </div>

      <div className="sm:max-w-xs">
        <Button type="submit" fullWidth={true} variant="primary" size="md">
          {t('dashboard.profile.save')}
        </Button>
      </div>
      <div aria-live="polite">
        {saved && <p role="status" className="text-sm text-green-700">{t('dashboard.profile.saved')}</p>}
      </div>
    </form>
  )
}

function OverviewTab({ onOpen }) {
  const { t } = useTranslation()
  const delivered = DEMO_ORDERS.filter((o) => o.status === 'delivered').length
  const open = DEMO_ORDERS.length - delivered

  const stats = [
    { labelKey: 'dashboard.overview.total_orders', value: DEMO_ORDERS.length },
    { labelKey: 'dashboard.overview.in_progress', value: open },
    { labelKey: 'dashboard.overview.delivered', value: delivered },
  ]

  return (
    <div className="space-y-8">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <li key={s.labelKey} className="rounded-lg border border-neutral-200 p-5">
            <p className="text-sm text-brand-gray">{t(s.labelKey)}</p>
            <p className="mt-1 text-3xl font-light text-brand-dark">{s.value}</p>
          </li>
        ))}
      </ul>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-light tracking-wide text-brand-dark">
            {t('dashboard.overview.recent_orders')}
          </h2>
          <button
            type="button"
            onClick={() => onOpen('orders')}
            className="text-sm font-medium text-brand-dark underline underline-offset-4"
          >
            {t('dashboard.overview.view_all')}
          </button>
        </div>
        <div className="mt-4">
          <OrdersList orders={DEMO_ORDERS.slice(0, 2)} />
        </div>
      </section>
    </div>
  )
}

/* ---------- Page ---------- */

export default function UserDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const active = TABS.find((item) => item.key === tab)

  const handleSignOut = () => {
    navigate('/login')
  }

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs items={[{ label: t('header.nav.home'), href: '/' }, { label: t('dashboard.my_account') }]} />

        <header className="mt-6 sm:mt-8">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {t('dashboard.hello', { name: DEMO_USER.name.split(' ')[0] })}
          </h1>
          <p className="mt-2 text-sm text-brand-gray sm:text-base">{t('dashboard.subtitle')}</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-4 lg:gap-10">
          <nav aria-label={t('dashboard.sections')} className="lg:col-span-1">
            <ul
              role="tablist"
              aria-orientation="horizontal"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible"
            >
              {TABS.map(({ key, labelKey, icon: Icon }) => (
                <li key={key} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    role="tab"
                    id={`dash-tab-${key}`}
                    aria-selected={tab === key}
                    aria-controls="dash-panel"
                    onClick={() => setTab(key)}
                    className={`flex w-full items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                      tab === key
                        ? 'border-brand-dark bg-brand-dark text-white'
                        : 'border-neutral-200 bg-white text-brand-dark hover:border-brand-dark'
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {t(labelKey)}
                  </button>
                </li>
              ))}
              <li className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <LogOut size={16} aria-hidden="true" />
                  {t('dashboard.sign_out')}
                </button>
              </li>
            </ul>
          </nav>

          <section
            id="dash-panel"
            role="tabpanel"
            aria-labelledby={`dash-tab-${tab}`}
            className="min-w-0 lg:col-span-3"
          >
            <h2 className="mb-5 font-serif text-2xl font-light tracking-wide text-brand-dark">
              {t(active.labelKey)}
            </h2>

            {tab === 'overview' && <OverviewTab onOpen={setTab} />}
            {tab === 'orders' && <OrdersList orders={DEMO_ORDERS} />}
            {tab === 'wishlist' && <WishlistTab />}
            {tab === 'profile' && <ProfileTab />}
          </section>
        </div>
      </Container>
    </main>
  )
}