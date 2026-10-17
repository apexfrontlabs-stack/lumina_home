import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import {
  layoutAssetsData,
  servicesData,
  teamData,
  testimonialsData,
} from '../../data/layoutData'

const VALUE_IDS = ['honest', 'durable', 'care']

function SectionHeading({ title, text }) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
        {title}
      </h2>
      {text && (
        <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">{text}</p>
      )}
    </div>
  )
}

export default function About() {
  const { t } = useTranslation()

  return (
    <main className="bg-white">
      {/* Banner */}
      <section className="relative isolate overflow-hidden bg-stone-100">
        <img
          src={layoutAssetsData.banners.about}
          alt={t('about.banner_alt')}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 bg-neutral-950/45" />
        <Container className="flex min-h-[220px] flex-col justify-end pb-8 pt-16 sm:min-h-[300px] sm:pb-12 lg:min-h-[380px]">
          <h1 className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl lg:text-5xl">
            {t('about.title')}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {t('about.subtitle')}
          </p>
        </Container>
      </section>

      <Container className="py-6">
        <Breadcrumbs
          items={[{ label: t('header.nav.home'), href: '/' }, { label: t('header.nav.about') }]}
        />
      </Container>

      {/* Story */}
      <section className="pb-12 sm:pb-16 lg:pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <SectionHeading title={t('about.story.title')} />
            <div className="space-y-4 text-sm leading-relaxed text-brand-gray sm:text-base">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
        <Container>
          <SectionHeading title={t('about.values.heading')} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUE_IDS.map((id) => (
              <div key={id} className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="font-serif text-lg tracking-wide text-brand-dark">
                  {t(`about.values.${id}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                  {t(`about.values.${id}.text`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <SectionHeading
            title={t('about.services.heading')}
            text={t('about.services.text')}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {servicesData.map((service) => (
              <figure key={service.id} className="overflow-hidden rounded-lg bg-stone-100">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={t(service.nameKey)}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="bg-white px-1 pt-3 text-sm font-medium text-brand-dark">
                  {t(service.nameKey)}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
        <Container>
          <SectionHeading title={t('about.team.heading')} text={t('about.team.text')} />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {teamData.map((person) => (
              <li key={person.id}>
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-brand-dark sm:text-base">
                  {person.name}
                </p>
                <p className="text-xs text-brand-gray sm:text-sm">{t(person.roleKey)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <SectionHeading title={t('about.testimonials.heading')} />
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonialsData.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-lg border border-neutral-200 p-5 sm:p-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-full bg-stone-100 object-cover sm:h-14 sm:w-14"
                  loading="lazy"
                />
                <blockquote className="min-w-0">
                  <p className="text-sm leading-relaxed text-brand-gray sm:text-base">
                    {t('about.testimonials.quote', { review: t(item.reviewKey) })}
                  </p>
                  <footer className="mt-3 text-sm">
                    <span className="font-medium text-brand-dark">{item.name}</span>
                    <span className="text-brand-gray">, {t(item.roleKey)}</span>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Call to action */}
      <section className="bg-brand-dark py-12 text-center sm:py-16">
        <Container>
          <h2 className="font-serif text-2xl font-light tracking-wide text-white sm:text-3xl">
            {t('about.cta.title')}
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/shop"
              className="w-full rounded-md bg-white px-6 py-3 text-sm font-medium text-brand-dark transition-opacity hover:opacity-90 sm:w-auto"
            >
              {t('about.cta.browse')}
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
            >
              {t('about.cta.talk')}
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}