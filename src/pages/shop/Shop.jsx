
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Check,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'

import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { Skeleton } from '../../components/common/Skeleton'
import { useCart } from '../../context/CartContext'
import useWishlist from '../../hooks/useWishlist'
import { productsData } from '../../data/productData'
import { productImage } from '../../utils/helper'
import {
  productName,
  productDescription,
  categoryLabel,
} from '../../utils/i18nHelper'
import { useCurrency } from '../../context/CurrencyContext'

const PER_PAGE = 12

const ROOMS = {
  'living-room': {
    labelKey: 'shop.rooms.living_room',
    categories: [
      'living-room',
      'armchair',
      'chair',
      'coffee-table',
      'side-table',
      'sideboard',
      'tv-unit',
      'rug',
      'lamp',
      'mirror',
      'shelves',
      'table',
      'trunk',
    ],
  },
  bedroom: {
    labelKey: 'shop.rooms.bedroom',
    categories: [
      'bed',
      'nightstand',
      'dresser',
      'wardrobe',
      'mirror',
      'trunk',
      'lamp',
      'rug',
    ],
  },
  dining: {
    labelKey: 'shop.rooms.dining',
    categories: [
      'dining-table',
      'dining-chair',
      'bar-stool',
      'sideboard',
      'kitchen',
    ],
  },
  office: {
    labelKey: 'shop.rooms.office',
    categories: [
      'desk',
      'office-desk',
      'office-chair',
      'shelves',
      'lamp',
    ],
  },
}

// Product prices USD base currency mein hain.
const PRICE_RANGES = [
  { key: '0-200', min: 0, max: 200 },
  { key: '200-500', min: 200, max: 500 },
  { key: '500-1000', min: 500, max: 1000 },
  { key: '1000-', min: 1000, max: Infinity },
]

const priceLabel = (t, r, formatPrice) => {
  if (r.max === Infinity) {
    return t('shop.price.over', { amount: formatPrice(r.min) })
  }

  if (r.min === 0) {
    return t('shop.price.under', { amount: formatPrice(r.max) })
  }

  return t('shop.price.between', {
    min: formatPrice(r.min),
    max: formatPrice(r.max),
  })
}

const SORTS = [
  { key: 'featured', labelKey: 'shop.sort.featured' },
  { key: 'newest', labelKey: 'shop.sort.newest' },
  { key: 'price-asc', labelKey: 'shop.sort.price_asc' },
  { key: 'price-desc', labelKey: 'shop.sort.price_desc' },
  { key: 'rating', labelKey: 'shop.sort.rating' },
]

const CATEGORY_SLUGS = [
  ...new Set(productsData.map((p) => p.category)),
]

/* ---------- Product image ---------- */

// Skeleton sirf image load hone tak dikhega.
// Cached images aur failed image requests bhi handle hote hain.
function ShopProductImage({ src, alt, className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Image source badalne par purani loading state reset karo.
    setImageLoaded(false)
    setImageError(false)
  }, [src])

  return (
    <div className={`relative h-full w-full overflow-hidden bg-stone-100 ${className}`}>
      {!imageLoaded && !imageError && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
      )}

      {imageError ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => {
            setImageLoaded(true)
            setImageError(false)
          }}
          onError={() => {
            setImageError(true)
            setImageLoaded(false)
          }}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-500 ${
            imageLoaded
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

/* ---------- Product card ---------- */

function ShopCard({ product }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const { ids = [], toggle } = useWishlist()
  const { formatPrice } = useCurrency()
  const [added, setAdded] = useState(false)

  const wished = ids.includes(product.id)
  const name = productName(t, product)

  const handleAdd = () => {
    addToCart(
      { ...product, image: productImage(product) },
      1
    )

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <li className="group flex flex-col">
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className="block overflow-hidden rounded-lg bg-stone-100"
        >
          <div className="aspect-[4/5] w-full">
            <ShopProductImage
              src={productImage(product)}
              alt={name}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {product.isNew && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-dark">
            {t('badge.new')}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={wished}
          aria-label={
            wished
              ? t('shop.wishlist_remove', { name })
              : t('shop.wishlist_add', { name })
          }
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        >
          <Heart
            size={16}
            aria-hidden="true"
            className={
              wished ? 'fill-red-500 text-red-500' : ''
            }
          />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-medium text-brand-dark hover:underline sm:text-base"
        >
          {name}
        </Link>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-brand-dark sm:text-base">
            {formatPrice(product.price)}
          </p>

          <span className="inline-flex items-center gap-1 text-xs text-brand-gray">
            <Star
              size={13}
              className="fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="font-medium text-brand-dark">
              {product.rating.toFixed(1)}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-brand-dark text-sm font-medium text-brand-dark transition-colors hover:bg-brand-dark hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? (
            <>
              <Check size={16} aria-hidden="true" />
              {t('product.added')}
            </>
          ) : product.inStock ? (
            t('product.add_to_cart')
          ) : (
            t('product.out_of_stock')
          )}
        </button>
      </div>
    </li>
  )
}

/* ---------- Filters ---------- */

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-b border-neutral-200 py-5 first:pt-0">
      <legend className="mb-3 text-sm font-medium text-brand-dark">
        {title}
      </legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  )
}

function RadioRow({ name, checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-brand-gray hover:text-brand-dark">
      <span className="flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-neutral-950"
        />
        {label}
      </span>

      {count != null && (
        <span className="text-xs text-neutral-400">{count}</span>
      )}
    </label>
  )
}

function FilterPanel({ filters, update, categories }) {
  const { t } = useTranslation()
  const { formatPrice } = useCurrency()
  const { category, room, price, onlyNew } = filters

  return (
    <div>
      <FilterGroup title={t('shop.filter_room')}>
        <RadioRow
          name="room"
          checked={!room}
          onChange={() => update({ room: '' })}
          label={t('shop.all_rooms')}
        />

        {Object.entries(ROOMS).map(([slug, r]) => (
          <RadioRow
            key={slug}
            name="room"
            checked={room === slug}
            onChange={() => update({ room: slug, category: '' })}
            label={t(r.labelKey)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t('shop.filter_category')}>
        <RadioRow
          name="category"
          checked={!category}
          onChange={() => update({ category: '' })}
          label={t('shop.all_categories')}
        />

        {categories.map((c) => (
          <RadioRow
            key={c.slug}
            name="category"
            checked={category === c.slug}
            onChange={() => update({ category: c.slug, room: '' })}
            label={c.label}
            count={c.count}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t('shop.filter_price')}>
        <RadioRow
          name="price"
          checked={!price}
          onChange={() => update({ price: '' })}
          label={t('shop.any_price')}
        />

        {PRICE_RANGES.map((r) => (
          <RadioRow
            key={r.key}
            name="price"
            checked={price === r.key}
            onChange={() => update({ price: r.key })}
            label={priceLabel(t, r, formatPrice)}
          />
        ))}
      </FilterGroup>

      <fieldset className="py-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-gray hover:text-brand-dark">
          <input
            type="checkbox"
            checked={onlyNew}
            onChange={(e) =>
              update({ filter: e.target.checked ? 'new' : '' })
            }
            className="h-4 w-4 accent-neutral-950"
          />
          {t('shop.new_only')}
        </label>
      </fieldset>
    </div>
  )
}

/* ---------- Pagination ---------- */

function Pagination({ page, totalPages, onChange }) {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  )

  return (
    <nav
      aria-label={t('shop.pages_nav')}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-10 rounded-md border border-neutral-300 px-4 text-sm text-brand-dark hover:border-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('blog.previous')}
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          aria-label={t('shop.page_n', { n })}
          className={`h-10 w-10 rounded-md border text-sm ${
            n === page
              ? 'border-brand-dark bg-brand-dark text-white'
              : 'border-neutral-300 text-brand-dark hover:border-brand-dark'
          }`}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-10 rounded-md border border-neutral-300 px-4 text-sm text-brand-dark hover:border-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('blog.next')}
      </button>
    </nav>
  )
}

/* ---------- Page ---------- */

export default function Shop() {
  const { t, i18n } = useTranslation()
  const { formatPrice } = useCurrency()
  const [params, setParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filters = {
    category: params.get('category') ?? '',
    room: params.get('room') ?? '',
    price: params.get('price') ?? '',
    sort: params.get('sort') ?? 'featured',
    q: params.get('q') ?? '',
    onlyNew: params.get('filter') === 'new',
  }

  const page = Math.max(
    1,
    Number(params.get('page')) || 1
  )

  // Categories current language mein sort hoti hain.
  const categories = useMemo(
    () =>
      CATEGORY_SLUGS.map((slug) => ({
        slug,
        label: categoryLabel(t, slug),
        count: productsData.filter(
          (p) => p.category === slug
        ).length,
      })).sort((a, b) =>
        a.label.localeCompare(b.label, i18n.language)
      ),
    [t, i18n.language]
  )

  // Filter update par pagination ko page 1 par reset karo.
  const update = (changes) => {
    const next = new URLSearchParams(params)

    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value == null) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })

    if (!('page' in changes)) {
      next.delete('page')
    }

    setParams(next)
  }

  const clearAll = () => setParams(new URLSearchParams())

  const results = useMemo(() => {
    const { category, room, price, sort, q, onlyNew } = filters
    const range = PRICE_RANGES.find((r) => r.key === price)
    const term = q.trim().toLowerCase()

    let list = productsData.filter((p) => {
      if (category && p.category !== category) return false

      if (
        room &&
        !ROOMS[room]?.categories.includes(p.category)
      ) {
        return false
      }

      if (
        range &&
        (p.price < range.min || p.price >= range.max)
      ) {
        return false
      }

      if (onlyNew && !p.isNew) return false

      if (term) {
        const haystack = `
          ${productName(t, p)}
          ${productDescription(t, p)}
          ${categoryLabel(t, p.category)}
        `.toLowerCase()

        if (!haystack.includes(term)) return false
      }

      return true
    })

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating)
    } else if (sort === 'newest') {
      list = [...list].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew)
      )
    }

    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, t])

  const totalPages = Math.max(
    1,
    Math.ceil(results.length / PER_PAGE)
  )

  const currentPage = Math.min(page, totalPages)

  const visible = results.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  )

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [currentPage])

  // Mobile filter drawer: Escape se close aur close hone par scroll restore.
  useEffect(() => {
    if (!drawerOpen) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  const title = filters.category
    ? categoryLabel(t, filters.category)
    : filters.room
      ? t(ROOMS[filters.room]?.labelKey ?? 'header.nav.shop')
      : filters.onlyNew
        ? t('shop.new_arrivals')
        : t('shop.all_furniture')

  const priceRange = PRICE_RANGES.find(
    (r) => r.key === filters.price
  )

  const chips = [
    filters.room && {
      key: 'room',
      label: t(ROOMS[filters.room]?.labelKey ?? 'header.nav.shop'),
    },
    filters.category && {
      key: 'category',
      label: categoryLabel(t, filters.category),
    },
    priceRange && {
      key: 'price',
      label: priceLabel(t, priceRange, formatPrice),
    },
    filters.onlyNew && {
      key: 'filter',
      label: t('shop.new_arrivals'),
    },
    filters.q && {
      key: 'q',
      label: `"${filters.q}"`,
    },
  ].filter(Boolean)

  return (
    <main className="bg-white py-8 sm:py-12">
      <Container>
        <Breadcrumbs
          items={[
            { label: t('header.nav.home'), href: '/' },
            { label: t('header.nav.shop') },
          ]}
        />

        <header className="mt-6 sm:mt-8">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 text-sm text-brand-gray">
            {results.length === 1
              ? t('shop.product_single', { total: results.length })
              : t('shop.product_plural', { total: results.length })}
          </p>
        </header>

        {/* Search aur sorting toolbar. */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="shop-search" className="sr-only">
              {t('shop.search_label')}
            </label>

            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              id="shop-search"
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={t('shop.search_placeholder')}
              className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 text-sm text-brand-dark placeholder:text-neutral-400 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 text-sm font-medium text-brand-dark hover:border-brand-dark lg:hidden"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              {t('shop.filters')}
            </button>

            <div className="flex-1 sm:flex-none">
              <label htmlFor="shop-sort" className="sr-only">
                {t('shop.sort_label')}
              </label>

              <select
                id="shop-sort"
                value={filters.sort}
                onChange={(e) =>
                  update({
                    sort:
                      e.target.value === 'featured'
                        ? ''
                        : e.target.value,
                  })
                }
                className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-brand-dark focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark sm:w-52"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {t(s.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active filter chips. */}
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => update({ [chip.key]: '' })}
                aria-label={t('shop.remove_filter', {
                  label: chip.label,
                })}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-brand-dark hover:border-brand-dark"
              >
                {chip.label}
                <X size={12} aria-hidden="true" />
              </button>
            ))}

            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-brand-dark underline underline-offset-4"
            >
              {t('shop.clear_all')}
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-4">
          {/* Desktop sidebar. */}
          <aside
            aria-label={t('shop.filters')}
            className="hidden lg:block"
          >
            <div className="sticky top-6 max-h-[calc(100dvh-3rem)] overflow-y-auto pr-2">
              <FilterPanel
                filters={filters}
                update={update}
                categories={categories}
              />
            </div>
          </aside>

          {/* Product results. */}
          <div className="lg:col-span-3">
            {visible.length > 0 ? (
              <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">
                {visible.map((product) => (
                  <ShopCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-neutral-200 p-10 text-center">
                <p className="text-base font-medium text-brand-dark">
                  {t('shop.no_results_title')}
                </p>

                <p className="mt-1 text-sm text-brand-gray">
                  {t('shop.no_results_text')}
                </p>

                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 text-sm font-medium text-brand-dark underline underline-offset-4"
                >
                  {t('shop.clear_all_filters')}
                </button>
              </div>
            )}

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(n) =>
                update({ page: n === 1 ? '' : String(n) })
              }
            />
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer. */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('shop.filters')}
        >
          <div
            className="absolute inset-0 bg-neutral-950/50"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="font-serif text-xl tracking-wide text-brand-dark">
                {t('shop.filters')}
              </h2>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t('shop.close_filters')}
                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel
                filters={filters}
                update={update}
                categories={categories}
              />
            </div>

            <div className="flex gap-3 border-t border-neutral-200 p-4">
              <button
                type="button"
                onClick={clearAll}
                className="h-11 flex-1 rounded-md border border-neutral-300 text-sm font-medium text-brand-dark"
              >
                {t('shop.clear_all')}
              </button>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="h-11 flex-1 rounded-md bg-brand-dark text-sm font-medium text-white"
              >
                {t('shop.show_results', { total: results.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
