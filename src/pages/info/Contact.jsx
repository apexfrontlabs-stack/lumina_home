import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { Input } from '../../components/common/Input'
import  Button  from '../../components/common/Button'
import { layoutAssetsData } from '../../data/layoutData'
import { SITE } from '@/config/siteInfo'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DETAILS = [
  { icon: Phone, labelKey: 'contact.details.phone', value: SITE.phone, href: SITE.phoneHref },
  { icon: Mail, labelKey: 'contact.details.email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, labelKey: 'contact.details.showroom', value: SITE.address },
  { icon: Clock, labelKey: 'contact.details.hours', valueKey: 'contact.hours_value' },
]

const INITIAL = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'contact.errors.name_required'
    if (!form.email.trim()) next.email = 'auth.errors.email_required'
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'auth.errors.email_invalid'
    if (!form.message.trim()) next.message = 'contact.errors.message_required'
    else if (form.message.trim().length < 10) next.message = 'contact.errors.message_min'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) {

      setSent(true)
    }
  }

  const reset = () => {
    setForm(INITIAL)
    setErrors({})
    setSent(false)
  }

  return (
    <main className="bg-white">
      {/* Banner */}
      <section className="relative isolate overflow-hidden bg-stone-100">
        <img
          src={layoutAssetsData.contact.main}
          alt={t('contact.banner_alt')}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 bg-neutral-950/45" />
        <Container className="flex min-h-[200px] flex-col justify-end pb-8 pt-16 sm:min-h-[260px] sm:pb-12 lg:min-h-[320px]">
          <h1 className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl lg:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {t('contact.subtitle')}
          </p>
        </Container>
      </section>

      <Container className="py-6">
        <Breadcrumbs
          items={[{ label: t('header.nav.home'), href: '/' }, { label: t('header.nav.contact') }]}
        />
      </Container>

      <section className="pb-12 sm:pb-16 lg:pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            {/* Details */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark sm:text-3xl">
                {t('contact.get_in_touch')}
              </h2>
              <ul className="mt-6 space-y-5">
                {DETAILS.map(({ icon: Icon, labelKey, value, valueKey, href }) => {
                  const text = valueKey ? t(valueKey) : value
                  return (
                    <li key={labelKey} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-brand-dark">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-brand-gray">{t(labelKey)}</p>
                        {href ? (
                          <a
                            href={href}
                            className="break-words text-sm font-medium text-brand-dark hover:underline sm:text-base"
                          >
                            {text}
                          </a>
                        ) : (
                          <p className="break-words text-sm font-medium text-brand-dark sm:text-base">
                            {text}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div role="status" aria-live="polite" className="rounded-lg border border-neutral-200 p-6 sm:p-8">
                  <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark">
                    {t('contact.sent_title')}
                  </h2>
                  <p className="mt-3 break-words text-sm leading-relaxed text-brand-gray">
                    {t('contact.sent_text', {
                      name: form.name.trim(),
                      email: form.email.trim(),
                    })}
                  </p>
                  <div className="mt-6 sm:max-w-xs">
                    <Button type="button" fullWidth={true} variant="primary" size="md" onClick={reset}>
                      {t('contact.send_another')}
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5 rounded-lg border border-neutral-200 p-5 sm:p-8"
                >
                  <h2 className="font-serif text-2xl font-light tracking-wide text-brand-dark">
                    {t('contact.form_title')}
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label={t('auth.register.full_name')}
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={update('name')}
                      placeholder={t('auth.register.full_name_placeholder')}
                      error={errors.name ? t(errors.name) : undefined}
                    />
                    <Input
                      label={t('auth.email_label')}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder={t('auth.email_placeholder')}
                      error={errors.email ? t(errors.email) : undefined}
                    />
                  </div>

                  <Input
                    label={t('contact.phone_optional')}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder={SITE.phone}
                  />

                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      {t('contact.message_label')}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={update('message')}
                      placeholder={t('contact.message_placeholder')}
                      aria-invalid={errors.message ? 'true' : undefined}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-neutral-400 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
                    />
                    {errors.message && (
                      <p id="contact-message-error" role="alert" className="mt-1 text-xs text-red-600">
                        {t(errors.message)}
                      </p>
                    )}
                  </div>

                  <Button type="submit" fullWidth={true} variant="primary" size="md">
                    {t('contact.send')}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}