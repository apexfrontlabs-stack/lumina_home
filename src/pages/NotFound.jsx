import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '../components/common/Container'
import { Button } from '../components/common/Button'

const LINKS = [
  { labelKey: 'notfound.links.shop', to: '/shop' },
  { labelKey: 'notfound.links.blog', to: '/blog' },
  { labelKey: 'success.track_an_order', to: '/order-tracking' },
  { labelKey: 'notfound.links.contact', to: '/contact' },
]

export default function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="bg-white py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="font-serif text-6xl font-light tracking-wide text-brand-dark sm:text-7xl">
            404
          </p>
          <h1 className="mt-4 font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
            {t('notfound.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
            {t('notfound.text')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" variant="primary" size="md" onClick={() => navigate('/')}>
              {t('notfound.home')}
            </Button>
            <Button type="button" variant="primary" size="md" onClick={() => navigate(-1)}>
              {t('notfound.back')}
            </Button>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-3 border-t border-neutral-200 pt-8 text-sm sm:grid-cols-2">
            {LINKS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-brand-dark underline underline-offset-4 hover:opacity-80"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  )
}