import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Minus, Plus } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { Input } from '../../components/common/Input'
import  Button  from '../../components/common/Button'
import { money } from '../../utils/helper'
import { TEAM_ROLES, TEAM_PRESETS, BOOKING_LIMITS, TIME_SLOTS } from '../../data/teamData'
import { SITE } from '@/config/siteInfo'

const PRESETS = TEAM_PRESETS
const MIN_HOURS = BOOKING_LIMITS.minHours
const MAX_HOURS = BOOKING_LIMITS.maxHours
const MAX_MEMBERS = BOOKING_LIMITS.maxMembers
const HOUR_OPTIONS = Array.from({ length: MAX_HOURS - MIN_HOURS + 1 }, (_, i) => MIN_HOURS + i)

const ZERO_COUNTS = Object.fromEntries(TEAM_ROLES.map((r) => [r.key, 0]))
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

const INITIAL_FORM = {
  name: '',
  phone: '',
  city: '',
  address: '',
  date: '',
  slot: TIME_SLOTS[0].id,
  notes: '',
}

const slotLabelKey = (id) => TIME_SLOTS.find((s) => s.id === id)?.labelKey

const formatDate = (iso, lang) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function BookSetup() {
  const { t, i18n } = useTranslation()
  const [counts, setCounts] = useState(ZERO_COUNTS)
  const [hours, setHours] = useState(3)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [booking, setBooking] = useState(null)

  const lines = TEAM_ROLES.filter((r) => counts[r.key] > 0).map((r) => ({
    ...r,
    count: counts[r.key],
    perHour: counts[r.key] * r.rate,
  }))
  const members = lines.reduce((sum, l) => sum + l.count, 0)
  const ratePerHour = lines.reduce((sum, l) => sum + l.perHour, 0)
  const total = ratePerHour * hours

  const changeCount = (key, delta) => {
    setCounts((prev) => ({ ...prev, [key]: Math.min(MAX_MEMBERS, Math.max(0, prev[key] + delta)) }))
    if (errors.team) setErrors((prev) => ({ ...prev, team: undefined }))
  }

  const applyPreset = (preset) => {
    setCounts({ ...ZERO_COUNTS, ...preset.counts })
    setHours(preset.hours)
    setErrors((prev) => ({ ...prev, team: undefined }))
  }

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (members === 0) next.team = 'booking.errors.team'
    if (!form.name.trim()) next.name = 'auth.errors.name_required'
    if (!form.phone.trim()) next.phone = 'checkout.errors.phone_required'
    else if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'checkout.errors.phone_invalid'
    if (!form.city.trim()) next.city = 'checkout.errors.city_required'
    if (!form.address.trim()) next.address = 'booking.errors.address_required'
    if (!form.date) next.date = 'booking.errors.date_required'
    else if (form.date < tomorrow) next.date = 'booking.errors.date_past'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      document.getElementById('team-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setBooking({ ...form, lines, hours, members, ratePerHour, total })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setCounts(ZERO_COUNTS)
    setHours(3)
    setForm(INITIAL_FORM)
    setErrors({})
    setBooking(null)
  }

  /* ---------- Confirmation ---------- */
  if (booking) {
    return (
      <main className="bg-white py-10 sm:py-14 lg:py-20">
        <Container>
          <div role="status" aria-live="polite" className="mx-auto max-w-2xl">
            <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
              {t('booking.received_title')}
            </h1>
            <p className="mt-3 break-words text-sm leading-relaxed text-brand-gray sm:text-base">
              <Trans
                i18nKey="booking.received_text"
                values={{
                  name: booking.name.trim(),
                  phone: booking.phone.trim(),
                  date: formatDate(booking.date, i18n.language),
                  slot: t(slotLabelKey(booking.slot)),
                }}
                components={{ date: <span className="font-medium text-brand-dark" /> }}
              />
            </p>

            <section className="mt-8 rounded-lg border border-neutral-200">
              <h2 className="border-b border-neutral-200 px-5 py-4 font-serif text-lg tracking-wide text-brand-dark">
                {t('booking.your_team')}
              </h2>
              <ul className="divide-y divide-neutral-200 px-5">
                {booking.lines.map((l) => (
                  <li key={l.key} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-brand-dark">
                      {l.count} &times; {t(l.titleKey)}
                      <span className="block text-xs text-brand-gray">
                        {t('booking.per_hour_each', { price: money(l.rate) })}
                      </span>
                    </span>
                    <span className="font-medium text-brand-dark">{money(l.perHour * booking.hours)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 border-t border-neutral-200 px-5 py-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-brand-gray">{t('booking.team_members')}</dt>
                  <dd className="text-brand-dark">{booking.members}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brand-gray">{t('booking.hours')}</dt>
                  <dd className="text-brand-dark">{booking.hours}</dd>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                  <dt className="text-brand-dark">{t('booking.estimated_cost')}</dt>
                  <dd className="text-brand-dark">{money(booking.total)}</dd>
                </div>
              </dl>
            </section>

            <p className="mt-4 text-xs leading-relaxed text-brand-gray">{t('booking.estimate_note')}</p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="sm:w-56">
                <Button type="button" fullWidth={true} variant="primary" size="md" onClick={reset}>
                  {t('booking.another')}
                </Button>
              </div>
              <Link to="/shop" className="text-sm font-medium text-brand-dark underline underline-offset-4">
                {t('booking.continue_shopping')}
              </Link>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  /* ---------- Booking page ---------- */
  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs
          items={[{ label: t('header.nav.home'), href: '/' }, { label: t('booking.title') }]}
        />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="font-serif text-3xl font-light tracking-wide text-brand-dark sm:text-4xl">
            {t('booking.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray sm:text-base">
            {t('booking.intro')}
          </p>
        </header>

        <form
          id="team-form"
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-12"
        >
          <div className="space-y-8 lg:col-span-2">
            {/* Quick packages */}
            <section aria-labelledby="presets-title">
              <h2 id="presets-title" className="text-sm font-medium text-brand-dark">
                {t('booking.quick_packages')}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {PRESETS.map((preset) => (
                  <li key={preset.nameKey}>
                    <button
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="h-full w-full rounded-lg border border-neutral-200 p-4 text-left hover:border-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    >
                      <span className="block text-sm font-medium text-brand-dark">{t(preset.nameKey)}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-brand-gray">
                        {t(preset.textKey)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* 1. Team */}
            <section className="rounded-lg border border-neutral-200 p-5 sm:p-8">
              <h2 className="font-serif text-xl tracking-wide text-brand-dark">{t('booking.step1_title')}</h2>
              <p className="mt-1 text-sm text-brand-gray">{t('booking.step1_text')}</p>

              <ul className="mt-5 divide-y divide-neutral-200">
                {TEAM_ROLES.map((role) => (
                  <li
                    key={role.key}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-dark sm:text-base">{t(role.titleKey)}</p>
                      <p className="mt-0.5 text-sm text-brand-gray">{t(role.textKey)}</p>
                      <p className="mt-1 text-sm font-semibold text-brand-dark">
                        {t('booking.per_hour', { price: money(role.rate) })}
                      </p>
                    </div>

                    <div
                      role="group"
                      aria-label={t('booking.count_aria', { role: t(role.titleKey) })}
                      className="inline-flex h-11 w-fit shrink-0 items-center rounded-md border border-neutral-300"
                    >
                      <button
                        type="button"
                        aria-label={t('booking.remove_one', { role: t(role.titleKey) })}
                        onClick={() => changeCount(role.key, -1)}
                        disabled={counts[role.key] === 0}
                        className="flex h-full w-11 items-center justify-center text-brand-dark hover:bg-neutral-100 disabled:opacity-40"
                      >
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
                        {counts[role.key]}
                      </span>
                      <button
                        type="button"
                        aria-label={t('booking.add_one', { role: t(role.titleKey) })}
                        onClick={() => changeCount(role.key, 1)}
                        disabled={counts[role.key] >= MAX_MEMBERS}
                        className="flex h-full w-11 items-center justify-center text-brand-dark hover:bg-neutral-100 disabled:opacity-40"
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {errors.team && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {t(errors.team)}
                </p>
              )}
            </section>

            {/* 2. Hours */}
            <section className="rounded-lg border border-neutral-200 p-5 sm:p-8">
              <h2 className="font-serif text-xl tracking-wide text-brand-dark">{t('booking.step2_title')}</h2>
              <p className="mt-1 text-sm text-brand-gray">{t('booking.min_hours', { hours: MIN_HOURS })}</p>
              <div className="mt-5 sm:max-w-xs">
                <label htmlFor="team-hours" className="mb-1.5 block text-sm font-medium text-brand-dark">
                  {t('booking.hours_label')}
                </label>
                <select
                  id="team-hours"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-brand-dark focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
                >
                  {HOUR_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {t('booking.hours_option', { hours: h })}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* 3. Details */}
            <section className="rounded-lg border border-neutral-200 p-5 sm:p-8">
              <h2 className="font-serif text-xl tracking-wide text-brand-dark">{t('booking.step3_title')}</h2>

              <div className="mt-5 space-y-5">
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
                    label={t('dashboard.profile.phone')}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder={SITE.phone}
                    error={errors.phone ? t(errors.phone) : undefined}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <Input
                      label={t('booking.address')}
                      type="text"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={update('address')}
                      placeholder={t('booking.address_placeholder')}
                      error={errors.address ? t(errors.address) : undefined}
                    />
                  </div>
                  <Input
                    label={t('dashboard.profile.city')}
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={update('city')}
                    placeholder={t('dashboard.profile.city')}
                    error={errors.city ? t(errors.city) : undefined}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label={t('booking.date')}
                    type="date"
                    min={tomorrow}
                    value={form.date}
                    onChange={update('date')}
                    error={errors.date ? t(errors.date) : undefined}
                  />
                  <div>
                    <label htmlFor="team-slot" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      {t('booking.start_time')}
                    </label>
                    <select
                      id="team-slot"
                      value={form.slot}
                      onChange={update('slot')}
                      className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-brand-dark focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {t(slot.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="team-notes" className="mb-1.5 block text-sm font-medium text-brand-dark">
                    {t('booking.notes_label')}
                  </label>
                  <textarea
                    id="team-notes"
                    rows={3}
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder={t('booking.notes_placeholder')}
                    className="w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-neutral-400 focus:border-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Cost summary */}
          <aside className="h-fit rounded-lg border border-neutral-200 bg-neutral-50 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-xl tracking-wide text-brand-dark">{t('booking.labour_cost')}</h2>

            {lines.length === 0 ? (
              <p className="mt-4 text-sm text-brand-gray">{t('booking.empty_summary')}</p>
            ) : (
              <ul className="mt-4 divide-y divide-neutral-200">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <span className="text-brand-dark">
                      {l.count} &times; {t(l.titleKey)}
                      <span className="block text-xs text-brand-gray">
                        {t('booking.rate_times_hours', { price: money(l.rate), hours })}
                      </span>
                    </span>
                    <span className="whitespace-nowrap font-medium text-brand-dark">
                      {money(l.perHour * hours)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-4 space-y-3 border-t border-neutral-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('booking.team_members')}</dt>
                <dd className="text-brand-dark">{members}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('booking.team_rate')}</dt>
                <dd className="text-brand-dark">{money(ratePerHour)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t('booking.hours')}</dt>
                <dd className="text-brand-dark">{hours}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                <dt className="text-brand-dark">{t('booking.estimated_total')}</dt>
                <dd className="text-brand-dark">{money(total)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Button type="submit" fullWidth={true} variant="primary" size="md">
                {t('booking.submit')}
              </Button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-brand-gray">{t('booking.summary_note')}</p>
          </aside>
        </form>
      </Container>
    </main>
  )
}