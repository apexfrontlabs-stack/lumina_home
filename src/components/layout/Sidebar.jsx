import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ChevronRight, Search, Users, X } from 'lucide-react'
import { productsData } from '../../data/productData'
import { productImage, money } from '../../utils/helper'

const toLabel = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const CATEGORIES = [...new Set(productsData.map((p) => p.category))].map((slug) => {
  const products = productsData.filter((p) => p.category === slug)
  return { slug, products, cover: products[0] }
})

export default function Sidebar({ open, onClose }) {
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const closeRef = useRef(null)

  const productName = (p) =>
    t(p.nameKey ?? `products.${String(p.id).replace(/-/g, '_')}.name`, {
      defaultValue: p.name ?? p.id,
    })

  const categories = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        label: t(`product_categories.${c.slug.replace(/-/g, '_')}`, {
          defaultValue: toLabel(c.slug),
        }),
      })).sort((a, b) => a.label.localeCompare(b.label, i18n.language)),
    [t, i18n.language]
  )

  useEffect(() => {
    if (open) {
      setSelected(null)
      setQuery('')
      closeRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? categories.filter((c) => c.label.toLowerCase().includes(q)) : categories
  }, [query, categories])

  const active = categories.find((c) => c.slug === (selected ?? list[0]?.slug))

  const images = active
    ? active.products.flatMap((p) =>
        Array.from({ length: Math.min(p.imagesCount, 6) }, (_, i) => ({ product: p, n: i + 1 }))
      )
    : []

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 motion-reduce:transition-none ${
        open ? 'visible' : 'invisible'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={t('sidebar.title')}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-neutral-950/50 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute inset-y-0 left-0 flex w-[92%] max-w-md flex-col bg-white shadow-xl transition-transform duration-300 motion-reduce:transition-none md:w-full md:max-w-3xl ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="font-serif text-xl font-light tracking-wide text-brand-dark">{t('sidebar.title')}</h2>
            <p className="text-xs text-brand-gray">
              {t('sidebar.categories_count', { total: categories.length })}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('sidebar.close')}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 md:grid-cols-[15rem_minmax(0,1fr)]">
          {/* Left: category list */}
          <div
            className={`min-h-0 flex-col overflow-y-auto border-neutral-200 md:flex md:border-r ${
              selected ? 'hidden' : 'flex'
            }`}
          >
            <div className="sticky top-0 z-10 bg-white p-4">
              <label htmlFor="sidebar-search" className="sr-only">{t('sidebar.search')}</label>
              <div className="relative">
                <Search
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="sidebar-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('sidebar.search')}
                  className="h-10 w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 text-sm text-brand-dark placeholder:text-neutral-400 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
                />
              </div>
            </div>

            <ul className="px-2 pb-4">
              <li>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-brand-dark hover:bg-neutral-100"
                >
                  {t('sidebar.all_furniture')}
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>
              </li>

              {list.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.slug)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-brand-dark hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
                      active?.slug === c.slug ? 'md:bg-neutral-100 md:font-medium' : ''
                    }`}
                  >
                    <img
                      src={productImage(c.cover)}
                      alt=""
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-md bg-stone-100 object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate">{c.label}</span>
                    <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-neutral-400" />
                  </button>
                </li>
              ))}

              {list.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-brand-gray">
                  {t('sidebar.no_category', { query })}
                </li>
              )}
            </ul>
          </div>

          {/* Right: images of the selected category */}
          <div className={`min-h-0 overflow-y-auto md:block ${selected ? 'block' : 'hidden'}`}>
            {active && (
              <div className="p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-brand-dark hover:underline md:hidden"
                >
                  <ArrowLeft size={16} aria-hidden="true" /> {t('sidebar.all_categories')}
                </button>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-light tracking-wide text-brand-dark">
                      {active.label}
                    </h3>
                    <p className="mt-1 text-sm text-brand-gray">
                      {active.products.length === 1
                        ? t('sidebar.piece', { total: active.products.length })
                        : t('sidebar.pieces', { total: active.products.length })}
                    </p>
                  </div>
                  <Link
                    to={`/shop?category=${active.slug}`}
                    onClick={onClose}
                    className="shrink-0 text-sm font-medium text-brand-dark underline underline-offset-4 hover:opacity-80"
                  >
                    {t('sidebar.shop_all')}
                  </Link>
                </div>

                <ul className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
                  {images.map(({ product, n }, i) => {
                    const big = i === 0 && images.length > 2
                    return (
                      <li key={`${product.id}-${n}`} className={big ? 'col-span-2 md:row-span-2' : ''}>
                        <Link
                          to={`/product/${product.id}`}
                          onClick={onClose}
                          className={`group block overflow-hidden rounded-lg bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
                            big ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-square'
                          }`}
                        >
                          <img
                            src={productImage(product, n)}
                            alt={t('sidebar.photo_alt', { name: productName(product), n })}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <ul className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
                  {active.products.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between gap-3 py-3 text-sm hover:underline"
                      >
                        <span className="min-w-0 truncate font-medium text-brand-dark">{productName(p)}</span>
                        <span className="shrink-0 font-semibold text-brand-dark">{money(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Link
          to="/book-setup"
          onClick={onClose}
          className="flex items-center gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-brand-dark hover:bg-neutral-100"
        >
          <Users size={18} aria-hidden="true" />
          <span className="flex-1">
            <span className="block font-medium">{t('sidebar.help_title')}</span>
            <span className="block text-xs text-brand-gray">{t('sidebar.help_subtitle')}</span>
          </span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}