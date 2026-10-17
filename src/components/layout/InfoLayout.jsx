import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { Breadcrumbs } from '../common/Breadcrumbs'

export function InfoLayout({ title, intro, updated, children }) {
  const { t } = useTranslation()

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs
          items={[{ label: t('header.nav.home'), href: '/' }, { label: title }]}
        />

        <header className="mt-6 max-w-3xl border-b border-neutral-200 pb-6 sm:mt-8 sm:pb-8">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
              {intro}
            </p>
          )}
          {updated && (
            <p className="mt-3 text-xs text-brand-gray">
              {t('common.last_updated', { date: updated })}
            </p>
          )}
        </header>

        <div className="mt-8 max-w-3xl space-y-10 sm:mt-10">{children}</div>
      </Container>
    </main>
  )
}

export function InfoSection({ title, children }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-light tracking-wide text-brand-dark sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-gray sm:text-base">
        {children}
      </div>
    </section>
  )
}