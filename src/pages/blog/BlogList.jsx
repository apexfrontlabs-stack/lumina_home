import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { blogPosts, blogCategories } from '../../data/blogPosts'

const POSTS_PER_PAGE = 6
const ALL = 'all'

function PostCard({ post }) {
  const { t } = useTranslation()

  return (
    <li>
      <Link to={`/blog/${post.slug}`} className="group block">
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-stone-100">
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <p className="mt-3 text-xs text-brand-gray">
          {t(post.categoryKey)} &middot; {t(post.dateKey)}
        </p>
        <h3 className="mt-1 text-base font-medium text-brand-dark group-hover:underline sm:text-lg">
          {t(post.titleKey)}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-brand-gray">{t(post.excerptKey)}</p>
      </Link>
    </li>
  )
}

export default function BlogList() {
  const { t } = useTranslation()
  const [category, setCategory] = useState(ALL)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  // Search translated text mein hota hai, taake har zuban mein sahi chale
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return blogPosts.filter((post) => {
      const matchCategory = category === ALL || post.categoryKey === category
      const matchQuery =
        !q ||
        t(post.titleKey).toLowerCase().includes(q) ||
        t(post.excerptKey).toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [category, query, t])

  const showFeatured = category === ALL && !query.trim() && page === 1
  const featured = showFeatured ? filtered[filtered.length - 1] : null
  const rest = featured ? filtered.filter((p) => p.id !== featured.id) : filtered

  const totalPages = Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visible = rest.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const changeCategory = (value) => {
    setCategory(value)
    setPage(1)
  }

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs items={[{ label: t('header.nav.home'), href: '/' }, { label: t('header.nav.blog') }]} />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {t('blog.list_title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
            {t('blog.list_subtitle')}
          </p>
        </header>

        {/* Search + categories */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={t('blog.filter_by_category')} className="flex flex-wrap gap-2">
            {[ALL, ...blogCategories].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => changeCategory(name)}
                aria-pressed={category === name}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                  category === name
                    ? 'border-brand-dark bg-brand-dark text-white'
                    : 'border-neutral-300 bg-white text-brand-dark hover:border-brand-dark'
                }`}
              >
                {name === ALL ? t('blog.all') : t(name)}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="blog-search" className="sr-only">{t('blog.search')}</label>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder={t('blog.search')}
              className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 text-sm text-brand-dark placeholder:text-neutral-400 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
            />
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group mt-10 grid overflow-hidden rounded-lg border border-neutral-200 lg:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden bg-stone-100 lg:aspect-auto lg:min-h-[320px]">
              <img
                src={featured.image}
                alt=""
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-xs text-brand-gray">
                {t('blog.latest')} &middot; {t(featured.categoryKey)} &middot; {t(featured.dateKey)}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-light tracking-wide text-brand-dark group-hover:underline sm:text-3xl">
                {t(featured.titleKey)}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
                {t(featured.excerptKey)}
              </p>
              <p className="mt-4 text-sm font-medium text-brand-dark underline underline-offset-4">
                {t('blog.read_article')}
              </p>
            </div>
          </Link>
        )}

        {/* Grid */}
        {visible.length > 0 ? (
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>
        ) : (
          !featured && (
            <div className="mt-12 rounded-lg border border-neutral-200 p-8 text-center">
              <p className="text-base font-medium text-brand-dark">{t('blog.no_results_title')}</p>
              <p className="mt-1 text-sm text-brand-gray">{t('blog.no_results_text')}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  changeCategory(ALL)
                }}
                className="mt-4 text-sm font-medium text-brand-dark underline underline-offset-4"
              >
                {t('blog.clear_filters')}
              </button>
            </div>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label={t('blog.pages_nav')} className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 rounded-md border border-neutral-300 px-4 text-sm text-brand-dark hover:border-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('blog.previous')}
            </button>
            <span className="px-2 text-sm text-brand-gray">
              {t('blog.page_of', { current: currentPage, total: totalPages })}
            </span>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 rounded-md border border-neutral-300 px-4 text-sm text-brand-dark hover:border-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('blog.next')}
            </button>
          </nav>
        )}
      </Container>
    </main>
  )
}