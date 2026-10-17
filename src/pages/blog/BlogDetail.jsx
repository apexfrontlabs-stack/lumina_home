import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Link2, MessageCircle, Check } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { blogPosts } from '../../data/blogPosts'
import { productsData } from '../../data/productData'
import { productImage, money } from '../../utils/helper'

function Block({ block }) {
  const { t } = useTranslation()

  if (block.type === 'h2') {
    return (
      <h2 className="mt-10 font-serif text-xl font-light tracking-wide text-brand-dark sm:text-2xl">
        {t(block.key)}
      </h2>
    )
  }
  if (block.type === 'ul') {
    const items = t(block.listKey, { returnObjects: true })
    if (!Array.isArray(items)) return null
    return (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-brand-gray">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return <p className="mt-4 text-base leading-relaxed text-brand-gray">{t(block.key)}</p>
}

export default function BlogDetail() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const [copied, setCopied] = useState(false)

  // Home page par links id se bane hain, isliye slug ya id dono chalte hain
  const index = blogPosts.findIndex((p) => p.slug === slug || p.id === slug)
  const post = blogPosts[index]
  const title = post ? t(post.titleKey) : ''

  useEffect(() => {
    window.scrollTo(0, 0)
    if (post) document.title = `${title} | Lumina Home`
  }, [post, title])

  if (!post) {
    return (
      <main className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
              {t('blog.not_found_title')}
            </h1>
            <p className="mt-3 text-sm text-brand-gray sm:text-base">{t('blog.not_found_text')}</p>
            <Link
              to="/blog"
              className="mt-6 inline-block text-sm font-medium text-brand-dark underline underline-offset-4"
            >
              {t('blog.back_to_all')}
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  const related = (post.relatedProductIds ?? [])
    .map((id) => productsData.find((p) => p.id === id))
    .filter(Boolean)

  const prev = blogPosts[index - 1]
  const next = blogPosts[index + 1]
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: t('header.nav.home'), href: '/' },
            { label: t('header.nav.blog'), href: '/blog' },
            { label: title },
          ]}
        />

        <article className="mx-auto mt-8 max-w-3xl">
          <header>
            <p className="text-sm text-brand-gray">{t(post.categoryKey)}</p>
            <h1 className="mt-2 font-serif text-3xl font-light leading-tight tracking-wide text-brand-dark sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-brand-gray">
              {t('blog.meta', {
                author: post.author,
                date: t(post.dateKey),
                minutes: post.readTime,
              })}
            </p>
          </header>

          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-stone-100">
            <img src={post.image} alt="" loading="eager" className="h-full w-full object-cover" />
          </div>

          <div className="mt-6">
            <p className="text-lg leading-relaxed text-brand-dark">{t(post.excerptKey)}</p>
            {post.contentKeys.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {/* Share */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6">
            <p className="text-sm font-medium text-brand-dark">{t('blog.share')}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-300 px-4 text-sm text-brand-dark hover:border-brand-dark"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-300 px-4 text-sm text-brand-dark hover:border-brand-dark"
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
              {copied ? t('blog.link_copied') : t('blog.copy_link')}
            </button>
          </div>
        </article>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-14 sm:mt-16">
            <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
              {t('blog.related_title')}
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
              {related.map((product) => {
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
                      <p className="mt-3 line-clamp-2 text-sm font-medium text-brand-dark group-hover:underline sm:text-base">
                        {productName}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-brand-dark">{money(product.price)}</p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Prev / next */}
        {(prev || next) && (
          <nav
            aria-label={t('blog.more_articles')}
            className="mt-14 grid gap-4 border-t border-neutral-200 pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="rounded-lg border border-neutral-200 p-4 hover:border-brand-dark">
                <p className="text-xs text-brand-gray">{t('blog.previous_article')}</p>
                <p className="mt-1 text-sm font-medium text-brand-dark">{t(prev.titleKey)}</p>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/blog/${next.slug}`}
                className="rounded-lg border border-neutral-200 p-4 hover:border-brand-dark sm:text-right"
              >
                <p className="text-xs text-brand-gray">{t('blog.next_article')}</p>
                <p className="mt-1 text-sm font-medium text-brand-dark">{t(next.titleKey)}</p>
              </Link>
            )}
          </nav>
        )}
      </Container>
    </main>
  )
}