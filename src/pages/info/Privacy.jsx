import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { SITE, formatMonthYear } from '@/config/siteInfo'

export default function Privacy() {
  const { t, i18n } = useTranslation()

  return (
    <main className="min-h-screen bg-stone-50/50 py-12 font-sans text-brand-dark sm:py-16">
      <Container className="max-w-3xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-brand-gray transition-colors hover:text-brand-dark"
        >
          <ArrowLeft size={16} aria-hidden="true" /> {t('common.back_to_home')}
        </Link>

        {/* Header Section */}
        <div className="mt-8 border-b border-stone-200 pb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark text-white shadow-sm">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {t('privacy.title')}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-wide text-brand-gray">
            {t('common.last_updated', { date: formatMonthYear(i18n.language) })}
          </p>
        </div>

        {/* Content Section */}
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-600">
          <p>
            <Trans
              i18nKey="privacy.intro"
              values={{ name: SITE.name }}
              components={{ brand: <span className="font-semibold text-brand-dark" /> }}
            />
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-serif text-lg font-medium text-brand-dark">
              <Eye size={18} aria-hidden="true" className="text-neutral-400" /> {t('privacy.s1.title')}
            </h2>
            <p>{t('privacy.s1.intro')}</p>
            <ul className="list-disc space-y-1.5 pl-5 text-stone-500">
              <li>
                <strong className="text-brand-dark">{t('privacy.s1.identity_label')}</strong>{' '}
                {t('privacy.s1.identity_text')}
              </li>
              <li>
                <strong className="text-brand-dark">{t('privacy.s1.contact_label')}</strong>{' '}
                {t('privacy.s1.contact_text')}
              </li>
              <li>
                <strong className="text-brand-dark">{t('privacy.s1.transaction_label')}</strong>{' '}
                {t('privacy.s1.transaction_text')}
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-serif text-lg font-medium text-brand-dark">
              <Lock size={18} aria-hidden="true" className="text-neutral-400" /> {t('privacy.s2.title')}
            </h2>
            <p>{t('privacy.s2.intro')}</p>
            <ul className="list-disc space-y-1.5 pl-5 text-stone-500">
              <li>{t('privacy.s2.item1')}</li>
              <li>{t('privacy.s2.item2')}</li>
              <li>{t('privacy.s2.item3')}</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-serif text-lg font-medium text-brand-dark">
              <FileText size={18} aria-hidden="true" className="text-neutral-400" /> {t('privacy.s3.title')}
            </h2>
            <p>{t('privacy.s3.text')}</p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 rounded-xl border border-stone-200 bg-stone-50/50 p-5">
            <h2 className="font-serif text-base font-medium text-brand-dark">{t('privacy.s4.title')}</h2>
            <p className="text-stone-500">{t('privacy.s4.text')}</p>
            <p className="mt-2 text-xs font-medium text-brand-dark">
              {t('privacy.s4.email_label')}{' '}
              <a
                href={`mailto:${SITE.email}`}
                className="underline underline-offset-4 hover:text-stone-600"
              >
                {SITE.email}
              </a>
            </p>
          </section>
        </div>
      </Container>
    </main>
  )
}