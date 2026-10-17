import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { themeConfig } from '@/config/themeConfig'
import { SITE } from '@/config/siteInfo'
import { Container } from '../common/Container'

const FacebookIcon = ({ size = 18, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const YoutubeIcon = ({ size = 18, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 12a9 9 0 0 1 9-9h1a9 9 0 0 1 9 9v0a9 9 0 0 1-9 9h-1a9 9 0 0 1-9-9Z" />
    <polygon points="10 9 15 12 10 15 10 9" />
  </svg>
)

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com', icon: YoutubeIcon },
]

const DEFAULT_COLUMNS = [
  {
    id: 'shop',
    title: 'Shop',
    links: [
      { labelKey: 'all_furniture', defaultLabel: 'All furniture', href: '/shop' },
      { labelKey: 'living_room', defaultLabel: 'Living room', href: '/shop?room=living-room' },
      { labelKey: 'bedroom', defaultLabel: 'Bedroom', href: '/shop?room=bedroom' },
      { labelKey: 'dining', defaultLabel: 'Dining', href: '/shop?room=dining' },
      { labelKey: 'office', defaultLabel: 'Office', href: '/shop?room=office' },
      { labelKey: 'new_arrivals', defaultLabel: 'New arrivals', href: '/shop?filter=new' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { labelKey: 'about_us', defaultLabel: 'About us', href: '/about' },
      { labelKey: 'blog', defaultLabel: 'Blog', href: '/blog' },
      { labelKey: 'book_a_team', defaultLabel: 'Book a team', href: '/book-setup' },
      { labelKey: 'contact', defaultLabel: 'Contact', href: '/contact' },
    ],
  },
  {
    id: 'help',
    title: 'Help',
    links: [
      { labelKey: 'faq', defaultLabel: 'FAQ', href: '/faq' },
      { labelKey: 'shipping_and_returns', defaultLabel: 'Shipping and returns', href: '/shipping-returns' },
      { labelKey: 'track_your_order', defaultLabel: 'Track your order', href: '/order-tracking' },
      { labelKey: 'my_account', defaultLabel: 'My account', href: '/dashboard' },
      { labelKey: 'wishlist', defaultLabel: 'Wishlist', href: '/wishlist' },
    ],
  },
]

const LEGAL = [
  { labelKey: 'privacy', defaultLabel: 'Privacy', href: '/privacy' },
  { labelKey: 'terms', defaultLabel: 'Terms', href: '/terms' },
]

const linkClass =
  'text-sm text-neutral-300 transition-colors hover:text-white focus:outline-none focus-visible:text-white focus-visible:underline'

export function Footer({ columns = DEFAULT_COLUMNS }) {
  const { t } = useTranslation()
  const name = themeConfig?.brand?.name ?? SITE.name

  const trustFeatures = [
    t('footer.trust.delivery', 'Delivery and set-up by our own team'),
    t('footer.trust.returns', '7-day easy returns'),
    t('footer.trust.warranty', '1-year warranty'),
    t('footer.trust.cod', 'Cash on delivery available'),
  ]

  return (
    <footer className="bg-brand-dark font-sans text-neutral-300">
      <Container>
        {/* Top: brand + links */}
        <div className="grid gap-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <Link to="/" className="font-serif text-3xl font-light tracking-wide text-white">
              {name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-300">
              {t('footer.tagline', 'Calm, well-made furniture, delivered and set up by our own team.')}
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-neutral-400" />
                <a href={SITE.phoneHref} className={linkClass}>
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-neutral-400" />
                <a href={`mailto:${SITE.email}`} className={`${linkClass} break-all`}>
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-neutral-400" />
                <span>
                  {SITE.address}
                  <span className="block text-xs text-neutral-400">
                    {t('contact.hours_value')}
                  </span>
                </span>
              </li>
            </ul>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`footer.socials.${label.toLowerCase()}`, label)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600 text-neutral-200 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label={t('footer.aria.footer_nav', 'Footer')}
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:pl-10"
          >
            {columns.map((col) => {
              const colId = col.id || col.title.toLowerCase()

              return (
                <div key={colId}>
                  <h2 className="mb-4 text-sm font-medium text-white">
                    {t(`footer.columns.${colId}.title`, col.title)}
                  </h2>
                  <ul className="space-y-3">
                    {col.links.map((l) => {
                      const linkId = l.labelKey ?? l.label?.toLowerCase().replace(/\s+/g, '_')

                      return (
                        <li key={l.href}>
                          <Link to={l.href} className={linkClass}>
                            {t(`footer.columns.${colId}.links.${linkId}`, l.defaultLabel ?? l.label)}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Trust strip */}
        <ul className="grid gap-3 border-t border-neutral-700 py-6 text-sm text-neutral-300 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-neutral-700 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-400">
            {t('footer.copyright', {
              year: new Date().getFullYear(),
              name,
              defaultValue: '© {{year}} {{name}}. All rights reserved.',
            })}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex items-center gap-5">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-xs text-neutral-400 hover:text-white">
                    {t(`footer.legal.${l.labelKey}`, l.defaultLabel)}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-600 px-4 py-2 text-xs text-neutral-200 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('footer.back_to_top', 'Back to top')} <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer