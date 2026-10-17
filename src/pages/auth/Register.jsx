import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { layoutAssetsData } from '../../data/layoutData'
import { Input } from '../../components/common/Input'
import  Button  from '../../components/common/Button'
import AuthBackButton from '../../components/common/AuthBackButton'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })

  const [errors, setErrors] = useState({})

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

    setForm((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Errors translation keys ke taur par save hote hain, render par translate hote hain
  const validate = () => {
    const next = {}
    const email = form.email.trim()

    if (!form.name.trim()) {
      next.name = 'auth.errors.name_required'
    }

    if (!email) {
      next.email = 'auth.errors.email_required'
    } else if (!EMAIL_PATTERN.test(email)) {
      next.email = 'auth.errors.email_invalid'
    }

    if (!form.password) {
      next.password = 'auth.errors.password_required'
    } else if (form.password.length < 8) {
      next.password = 'auth.errors.password_min'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'auth.errors.confirm_required'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'auth.errors.passwords_mismatch'
    }

    if (!form.terms) {
      next.terms = 'auth.errors.terms_required'
    }

    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const next = validate()
    setErrors(next)

    if (Object.keys(next).length === 0) {
      console.log('Register validated:', {
        name: form.name,
        email: form.email.trim(),
      })
    }
  }

  return (
    <div className="flex h-screen w-screen max-w-full overflow-hidden bg-white lg:flex-row">
      {/* Image section */}
      <div className="relative hidden h-full w-1/2 shrink-0 overflow-hidden bg-stone-100 lg:block">
        <img
          src={layoutAssetsData.auth.background}
          alt={t('auth.image_alt')}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[7000ms] lg:hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-neutral-950/10 mix-blend-multiply" />
      </div>

      {/* Registration form section */}
      <div className="flex h-full w-full flex-col justify-center overflow-hidden px-5 py-6 sm:px-10 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4">
            <AuthBackButton />
          </div>

          {/* Heading */}
          <div className="mb-4 text-start">
            <h1 className="font-serif text-2xl font-light tracking-wide text-neutral-950 sm:text-3xl">
              {t('auth.register.title')}
            </h1>
            <p className="mt-1 text-xs text-stone-500">{t('auth.register.subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Input
                label={t('auth.password_label')}
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={update('password')}
                placeholder={t('auth.register.password_placeholder')}
                error={errors.password ? t(errors.password) : undefined}
              />

              <Input
                label={t('auth.register.confirm_password')}
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder={t('auth.register.confirm_placeholder')}
                error={errors.confirmPassword ? t(errors.confirmPassword) : undefined}
              />
            </div>

            {/* Terms and privacy */}
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={update('terms')}
                  aria-invalid={errors.terms ? 'true' : undefined}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-950"
                />
                <span className="text-[11px] leading-relaxed text-stone-500">
                  <Trans
                    i18nKey="auth.register.terms_agreement"
                    components={{
                      terms: (
                        <Link
                          to="/terms"
                          className="text-neutral-950 underline underline-offset-4 hover:text-stone-700"
                        />
                      ),
                      privacy: (
                        <Link
                          to="/privacy"
                          className="text-neutral-950 underline underline-offset-4 hover:text-stone-700"
                        />
                      ),
                    }}
                  />
                </span>
              </label>

              {errors.terms && (
                <p role="alert" className="mt-0.5 text-[11px] text-red-600">
                  {t(errors.terms)}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth={true} variant="primary" size="md">
              {t('auth.register.submit')}
            </Button>
          </form>

          {/* Social sign-up */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-stone-100" />
            <span className="mx-3 flex-shrink text-[10px] font-medium uppercase tracking-widest text-stone-400">
              {t('auth.register.or_sign_up_with')}
            </span>
            <div className="flex-grow border-t border-stone-100" />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <Button type="button" variant="google">Google</Button>
            <Button type="button" variant="facebook">Facebook</Button>
          </div>

          {/* Login link */}
          <div className="border-t border-stone-100 pt-3 text-start">
            <p className="text-xs font-medium text-stone-500">
              {t('auth.register.already_have_account')}{' '}
              <Link
                to="/login"
                className="text-neutral-950 underline underline-offset-4 transition-colors hover:text-stone-700"
              >
                {t('auth.register.sign_in')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}