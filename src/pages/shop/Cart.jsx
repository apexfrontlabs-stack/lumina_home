import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { useCart } from '../../context/CartContext'
import { productImage, money, calcShipping, FREE_SHIPPING_OVER } from '../../utils/helper'
import { productName } from '../../utils/i18nHelper'

const MAX_QTY = 10

function CartRow({ item, onQuantity, onRemove }) {
  const { t } = useTranslation()
  const name = productName(t, item)

  return (
    <li className="flex gap-3 py-5 sm:gap-5">
      <Link to={`/product/${item.id}`} className="shrink-0">
        <img
          src={item.image ?? productImage(item)}
          alt={name}
          loading="lazy"
          className="h-24 w-24 rounded-lg bg-stone-100 object-cover sm:h-28 sm:w-28"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${item.id}`}
              className="line-clamp-2 text-sm font-medium text-brand-dark hover:underline sm:text-base"
            >
              {name}
            </Link>
            <p className="mt-0.5 text-xs text-brand-gray">{t('cart.each', { price: money(item.price) })}</p>
          </div>
          <p className="whitespace-nowrap text-sm font-semibold text-brand-dark sm:text-base">
            {money(item.price * item.quantity)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div
            role="group"
            aria-label={t('cart.quantity_of', { name })}
            className="inline-flex h-10 items-center rounded-md border border-neutral-300"
          >
            <button
              type="button"
              aria-label={t('common.decrease_quantity')}
              onClick={() => onQuantity(item.id, item.quantity - 1)}
              className="flex h-full w-10 items-center justify-center text-brand-dark hover:bg-neutral-100"
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
            <button
              type="button"
              aria-label={t('common.increase_quantity')}
              onClick={() => onQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= MAX_QTY}
              className="flex h-full w-10 items-center justify-center text-brand-dark hover:bg-neutral-100 disabled:opacity-40"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <Trash2 size={15} aria-hidden="true" /> {t('cart.remove')}
          </button>
        </div>
      </div>
    </li>
  )
}

export default function Cart() {
  const { t } = useTranslation()
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartSubtotal } = useCart()
  const shipping = calcShipping(cartSubtotal)
  const total = cartSubtotal + shipping
  const remaining = FREE_SHIPPING_OVER - cartSubtotal

  if (cart.length === 0) {
    return (
      <main className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
              {t('cart.empty_title')}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
              {t('cart.empty_text')}
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-brand-dark px-8 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
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
          items={[{ label: t('header.nav.home'), href: '/' }, { label: t('header.cart') }]}
        />

        <div className="mt-6 flex items-center justify-between sm:mt-8">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {t('cart.title_count', { total: cartCount })}
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-brand-gray hover:text-red-600 hover:underline"
          >
            {t('cart.clear')}
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-12">
          <ul className="divide-y divide-neutral-200 border-y border-neutral-200 lg:col-span-2">
            {cart.map((item) => (
              <CartRow key={item.id} item={item} onQuantity={updateQuantity} onRemove={removeFromCart} />
            ))}
          </ul>

          <aside className="h-fit rounded-lg border border-neutral-200 bg-neutral-50 p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="font-serif text-xl tracking-wide text-brand-dark">{t('cart.summary')}</h2>

            {remaining > 0 ? (
              <p className="mt-3 text-sm text-brand-gray">
                {t('cart.add_more_free', { amount: money(remaining) })}
              </p>
            ) : (
              <p className="mt-3 text-sm text-green-700">{t('cart.free_delivery_unlocked')}</p>
            )}

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('cart.subtotal')}</dt>
                <dd className="text-brand-dark">{money(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('cart.delivery')}</dt>
                <dd className="text-brand-dark">{shipping ? money(shipping) : t('cart.free')}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                <dt className="text-brand-dark">{t('cart.total')}</dt>
                <dd className="text-brand-dark">{money(total)}</dd>
              </div>
            </dl>

            <Link
              to="/checkout"
              className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-brand-dark text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              {t('cart.checkout')}
            </Link>
            <Link
              to="/shop"
              className="mt-4 block text-center text-sm font-medium text-brand-dark underline underline-offset-4"
            >
              {t('booking.continue_shopping')}
            </Link>
          </aside>
        </div>
      </Container>
    </main>
  )
}