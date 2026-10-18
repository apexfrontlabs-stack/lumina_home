import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Check,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'

import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { Accordion } from '../../components/common/Accordion'
import { ProductImage } from '../../components/common/ProductImage'

import { useCart } from '../../context/CartContext'
import useWishlist from '../../hooks/useWishlist'
import { productsData } from '../../data/productData'
import { productImage } from '../../utils/helper'
import { useCurrency } from '../../context/CurrencyContext'
import {
  productName,
  productDescription,
  categoryLabel,
} from '../../utils/i18nHelper'
import { SITE } from '@/config/siteInfo'

const MAX_QTY = 10

function RatingStars({ value }) {
  const full = Math.round(value)

  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          className={
            n <= full
              ? 'fill-amber-400 text-amber-400'
              : 'text-neutral-300'
          }
        />
      ))}
    </span>
  )
}

function ProductView({ product }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()
  const { ids = [], toggle } = useWishlist()

  const [activeImage, setActiveImage] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const wished = ids.includes(product.id)
  const name = productName(t, product)
  const description = productDescription(t, product)
  const category = categoryLabel(t, product.category)

  const images = Array.from(
    { length: product.imagesCount },
    (_, i) => i + 1
  )

  const related = [
    ...productsData.filter(
      (p) => p.category === product.category && p.id !== product.id
    ),
    ...productsData.filter(
      (p) => p.category !== product.category && p.id !== product.id
    ),
  ].slice(0, 4)

  const handleAdd = () => {
    addToCart(
      { ...product, image: productImage(product) },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const accordionItems = [
    {
      title: t('product.details_title'),
      content: t('product.details_text', {
        description,
        sku: product.sku,
        category,
      }),
    },
    {
      title: t('product.delivery_title'),
      content: t('product.delivery_text'),
    },
    {
      title: t('product.returns_title'),
      content: t('product.returns_text', {
        days: SITE.returnDays,
      }),
    },
  ]

  return (
    <main className="bg-white pb-24 pt-8 sm:pt-12 lg:pb-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: t('header.nav.home'), href: '/' },
            { label: t('header.nav.shop'), href: '/shop' },
            { label: name },
          ]}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <ProductImage
              key={`${product.id}-${activeImage}`}
              src={productImage(product, activeImage)}
              alt={t('product.photo_alt', {
                name,
                n: activeImage,
              })}
              loading="eager"
              className="aspect-square rounded-lg sm:aspect-[4/3] lg:aspect-square"
            />

            {images.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-6">
                {images.map((n) => (
                  <li key={n}>
                    <button
                      type="button"
                      onClick={() => setActiveImage(n)}
                      aria-label={t('product.show_photo', { n })}
                      aria-current={
                        activeImage === n ? 'true' : undefined
                      }
                      className={`aspect-square w-full overflow-hidden rounded-md border-2 bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                        activeImage === n
                          ? 'border-brand-dark'
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                    >
                      <ProductImage
                        src={productImage(product, n)}
                        alt=""
                        className="h-full w-full rounded-none"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-brand-gray">{category}</p>

              {product.isNew && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-brand-dark">
                  {t('badge.new')}
                </span>
              )}
            </div>

            <h1 className="mt-2 font-serif text-3xl font-light leading-tight tracking-wide text-brand-dark sm:text-4xl">
              {name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <RatingStars value={product.rating} />

              <span className="text-sm text-brand-gray">
                {t('product.rating_text', {
                  rating: product.rating.toFixed(1),
                  reviews: product.reviewCount,
                })}
              </span>
            </div>

            <p className="mt-5 text-3xl font-semibold text-brand-dark">
              {formatPrice(product.price)}
            </p>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-gray sm:text-base">
              {description}
            </p>

            <p
              className={`mt-4 text-sm font-medium ${
                product.inStock ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {product.inStock
                ? t('product.in_stock')
                : t('product.out_of_stock')}
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                role="group"
                aria-label={t('product.quantity')}
                className="inline-flex h-12 w-fit items-center rounded-md border border-neutral-300"
              >
                <button
                  type="button"
                  aria-label={t('common.decrease_quantity')}
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={quantity <= 1}
                  className="flex h-full w-11 items-center justify-center text-brand-dark hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Minus size={16} aria-hidden="true" />
                </button>

                <span
                  className="w-10 text-center text-sm tabular-nums"
                  aria-live="polite"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label={t('common.increase_quantity')}
                  onClick={() =>
                    setQuantity((q) => Math.min(MAX_QTY, q + 1))
                  }
                  disabled={quantity >= MAX_QTY}
                  className="flex h-full w-11 items-center justify-center text-brand-dark hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-brand-dark px-8 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {added ? (
                  <>
                    <Check size={16} aria-hidden="true" />
                    {t('product.added_to_cart')}
                  </>
                ) : (
                  t('product.add_to_cart')
                )}
              </button>

              <button
                type="button"
                onClick={() => toggle(product.id)}
                aria-pressed={wished}
                aria-label={
                  wished
                    ? t('common.remove_from_wishlist')
                    : t('common.add_to_wishlist')
                }
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-brand-dark hover:border-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <Heart
                  size={18}
                  aria-hidden="true"
                  className={
                    wished ? 'fill-red-500 text-red-500' : ''
                  }
                />
              </button>
            </div>

            <div aria-live="polite">
              {added && (
                <p role="status" className="mt-3 text-sm text-brand-gray">
                  {t('product.qty_added', { quantity })}{' '}
                  <Link
                    to="/cart"
                    className="font-medium text-brand-dark underline underline-offset-4"
                  >
                    {t('product.view_cart')}
                  </Link>
                </p>
              )}
            </div>

            <ul className="mt-6 grid gap-3 border-y border-neutral-200 py-5 sm:grid-cols-3">
              <li className="flex items-center gap-2 text-sm text-brand-dark">
                <Truck size={18} aria-hidden="true" />
                {t('product.trust_delivery')}
              </li>

              <li className="flex items-center gap-2 text-sm text-brand-dark">
                <RotateCcw size={18} aria-hidden="true" />
                {t('product.trust_returns', {
                  days: SITE.returnDays,
                })}
              </li>

              <li className="flex items-center gap-2 text-sm text-brand-dark">
                <ShieldCheck size={18} aria-hidden="true" />
                {t('product.trust_warranty')}
              </li>
            </ul>

            <Accordion items={accordionItems} className="mt-6" />

            <p className="mt-5 text-xs text-brand-gray">
              {t('product.sku', { sku: product.sku })}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
              {t('product.related_title')}
            </h2>

            <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
              {related.map((item) => {
                const itemName = productName(t, item)

                return (
                  <li key={item.id}>
                    <Link
                      to={`/product/${item.id}`}
                      className="group block"
                    >
                      <ProductImage
                        src={productImage(item)}
                        alt={itemName}
                        className="aspect-[4/5] rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                      />

                      <p className="mt-3 line-clamp-2 text-sm font-medium text-brand-dark group-hover:underline sm:text-base">
                        {itemName}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-brand-dark">
                        {formatPrice(item.price)}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs text-brand-gray">{name}</p>
          <p className="text-base font-semibold text-brand-dark">
            {formatPrice(product.price * quantity)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="ml-auto inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-dark px-6 text-sm font-medium text-white disabled:opacity-50"
        >
          {added ? (
            <>
              <Check size={16} aria-hidden="true" />
              {t('product.added')}
            </>
          ) : (
            t('product.add_to_cart')
          )}
        </button>
      </div>
    </main>
  )
}

export default function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams()

  const product = productsData.find((p) => p.id === id)
  const name = product ? productName(t, product) : ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (name) {
      document.title = `${name} | Lumina Home`
    }
  }, [name])

  if (!product) {
    return (
      <main className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
              {t('product.not_found_title')}
            </h1>

            <p className="mt-3 text-sm text-brand-gray sm:text-base">
              {t('product.not_found_text')}
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-block text-sm font-medium text-brand-dark underline underline-offset-4"
            >
              {t('product.back_to_shop')}
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return <ProductView key={product.id} product={product} />
}
