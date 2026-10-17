import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Truck, RotateCcw, ShieldCheck, Wallet, Star } from 'lucide-react'
import HeroSection from '../components/home/HeroSection'
import { Container } from '../components/common/Container'
import { useCart } from '../context/CartContext'
import { productsData } from '../data/productData'
import { layoutAssetsData, testimonialsData } from '../data/layoutData'
import { blogPosts } from '../data/blogPosts'
import { productImage, money } from '../utils/helper'
import { productName, categoryLabel } from '../utils/i18nHelper'
import { SITE } from '@/config/siteInfo'

/* ---------- Data ---------- */

const FEATURED_CATEGORIES = [
  'living-room', 'bed', 'dining-table', 'armchair',
  'wardrobe', 'desk', 'lamp', 'rug',
]

const categoryCards = FEATURED_CATEGORIES.map((slug) => {
  const first = productsData.find((p) => p.category === slug)
  return { slug, image: first ? productImage(first) : null }
})

const newArrivals = productsData.filter((p) => p.isNew).slice(0, 8)
const topRated = [...productsData].sort((a, b) => b.rating - a.rating).slice(0, 8)

const TRUST = [
  { icon: Truck, id: 'delivery' },
  { icon: RotateCcw, id: 'returns' },
  { icon: ShieldCheck, id: 'warranty' },
  { icon: Wallet, id: 'cod' },
]

/* ---------- Small shared pieces ---------- */

function SectionHeader({ title, text, linkTo, linkLabel }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
          {title}
        </h2>
        {text && <p className="mt-2 text-sm leading-relaxed text-brand-gray sm:text-base">{text}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-sm font-medium text-brand-dark underline underline-offset-4 hover:opacity-80"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

function Stars({ value }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-brand-gray">
      <Star size={13} className="fill-amber-400 text-amber-400" aria-hidden="true" />
      <span className="font-medium text-brand-dark">{value.toFixed(1)}</span>
    </span>
  )
}

function HomeProductCard({ product }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const name = productName(t, product)

  const handleAdd = () => {
    addToCart({ ...product, image: productImage(product) }, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <li className="group flex flex-col">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden rounded-lg bg-stone-100">
        <div className="aspect-[4/5] w-full">
          <img
            src={productImage(product)}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-dark">
            {t('badge.new')}
          </span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-medium text-brand-dark hover:underline sm:text-base"
        >
          {name}
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-brand-dark sm:text-base">{money(product.price)}</p>
          <Stars value={product.rating} />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-brand-dark text-sm font-medium text-brand-dark transition-colors hover:bg-brand-dark hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? (
            <>
              <Check size={16} aria-hidden="true" /> {t('product.added')}
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

/* ---------- Sections ---------- */

function CategoriesSection() {
  const { t } = useTranslation()

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeader
          title={t('sidebar.title')}
          text={t('home.categories.text')}
          linkTo="/shop"
          linkLabel={t('home.categories.view_all')}
        />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {categoryCards.map((cat) => (
            <li key={cat.slug}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded-lg bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <div className="aspect-[4/5] w-full">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/70 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
                  <p className="text-sm font-medium text-white sm:text-base">
                    {categoryLabel(t, cat.slug)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function ProductsSection() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('new')

  const groups = [
    { key: 'new', label: t('home.products.tab_new'), items: newArrivals },
    { key: 'top', label: t('home.products.tab_top'), items: topRated },
  ]
  const active = groups.find((g) => g.key === tab)

  return (
    <section className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeader
          title={t('home.products.title')}
          linkTo="/shop"
          linkLabel={t('home.products.view_all')}
        />

        <div role="tablist" aria-label={t('home.products.groups_aria')} className="mt-6 flex gap-2">
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              role="tab"
              id={`tab-${group.key}`}
              aria-selected={tab === group.key}
              aria-controls="home-products-panel"
              onClick={() => setTab(group.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                tab === group.key
                  ? 'border-brand-dark bg-brand-dark text-white'
                  : 'border-neutral-300 bg-white text-brand-dark hover:border-brand-dark'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <ul
          id="home-products-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4"
        >
          {active.items.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </ul>
      </Container>
    </section>
  )
}

function PromoSection() {
  const { t } = useTranslation()

  const promos = [
    {
      id: 'living',
      image: layoutAssetsData.banners.promo1,
      title: t('home.promo.living_title'),
      text: t('home.promo.living_text'),
      to: '/shop?category=living-room',
    },
    {
      id: 'bedroom',
      image: layoutAssetsData.banners.promo2,
      title: t('home.promo.bedroom_title'),
      text: t('home.promo.bedroom_text'),
      to: '/shop?category=bed',
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {promos.map((promo) => (
            <Link
              key={promo.id}
              to={promo.to}
              className="group relative isolate block overflow-hidden rounded-lg bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <img
                src={promo.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent" />
              <div className="flex min-h-[240px] flex-col justify-end p-5 text-white sm:min-h-[300px] sm:p-8">
                <h3 className="font-serif text-2xl font-light tracking-wide sm:text-3xl">{promo.title}</h3>
                <p className="mt-2 max-w-sm text-sm text-white/85">{promo.text}</p>
                <span className="mt-4 text-sm font-medium underline underline-offset-4">
                  {t('home.promo.shop_now')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

function TrustSection() {
  const { t } = useTranslation()

  return (
    <section className="border-y border-neutral-200 bg-white py-10 sm:py-12">
      <Container>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, id }) => (
            <li key={id} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-brand-dark">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-brand-dark sm:text-base">
                  {t(`home.trust.${id}.title`)}
                </p>
                <p className="mt-0.5 text-sm text-brand-gray">
                  {t(`home.trust.${id}.text`, { days: SITE.returnDays })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeader title={t('about.testimonials.heading')} />
        <ul className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonialsData.map((item) => (
            <li key={item.id} className="flex flex-col rounded-lg border border-neutral-200 bg-white p-5">
              <blockquote className="flex-1 text-sm leading-relaxed text-brand-gray">
                {t('about.testimonials.quote', { review: t(item.reviewKey) })}
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-full bg-stone-100 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-dark">{item.name}</p>
                  <p className="truncate text-xs text-brand-gray">{t(item.roleKey)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function BlogPreviewSection() {
  const { t } = useTranslation()
  const posts = blogPosts.slice(-3).reverse()

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeader
          title={t('home.blog.title')}
          text={t('home.blog.text')}
          linkTo="/blog"
          linkLabel={t('home.blog.read_all')}
        />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-stone-100">
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs text-brand-gray">{t(post.dateKey)}</p>
                <h3 className="mt-1 text-base font-medium text-brand-dark group-hover:underline">
                  {t(post.titleKey)}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function NewsletterSection() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [errorKey, setErrorKey] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) return setErrorKey('auth.errors.email_required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setErrorKey('auth.errors.email_invalid')
    setErrorKey('')
    // Backend nahi hai, isliye abhi sirf success message.
    setDone(true)
  }

  return (
    <section className="bg-brand-dark py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-2xl font-light tracking-wide text-white sm:text-3xl">
            {t('home.newsletter.title')}
          </h2>
          <p className="mt-2 text-sm text-white/80 sm:text-base">{t('home.newsletter.text')}</p>

          {done ? (
            <p role="status" className="mt-6 text-sm font-medium text-white">
              {t('home.newsletter.thanks')}
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="home-newsletter" className="sr-only">
                  {t('newsletter.email_label')}
                </label>
                <input
                  id="home-newsletter"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorKey) setErrorKey('')
                  }}
                  placeholder={t('auth.email_placeholder')}
                  aria-invalid={errorKey ? 'true' : undefined}
                  aria-describedby={errorKey ? 'home-newsletter-error' : undefined}
                  className="h-12 w-full rounded-md border border-white/30 bg-white px-4 text-sm text-brand-dark placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-md border border-white px-6 text-sm font-medium text-white transition-colors hover:bg-white hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                >
                  {t('newsletter.subscribe')}
                </button>
              </div>
              {errorKey && (
                <p id="home-newsletter-error" role="alert" className="mt-2 text-left text-xs text-red-300">
                  {t(errorKey)}
                </p>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}

/* ---------- Page ---------- */

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      <PromoSection />
      <TrustSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <NewsletterSection />
    </>
  )
}