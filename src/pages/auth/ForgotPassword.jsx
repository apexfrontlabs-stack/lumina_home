import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { layoutAssetsData } from '../../data/layoutData'
import { Input } from '../../components/common/Input'
import  Button  from '../../components/common/Button'
import AuthBackButton from '../../components/common/AuthBackButton'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [errorKey, setErrorKey] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) return setErrorKey('auth.errors.email_required')
    if (!EMAIL_PATTERN.test(value)) return setErrorKey('auth.errors.email_invalid')

    setErrorKey('')
    setSent(true)
  }

  return (
    <div className="flex h-screen w-screen max-w-full overflow-hidden bg-white lg:flex-row">
      {/* Image Section */}
      <div className="relative hidden h-full w-1/2 shrink-0 overflow-hidden bg-stone-100 lg:block">
        <img
          src={layoutAssetsData.auth.background}
          alt={t('auth.image_alt')}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[7000ms] lg:hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-neutral-950/10 mix-blend-multiply" />
      </div>

      {/* Form Section */}
      <div className="flex h-full w-full flex-col justify-center overflow-hidden px-5 py-6 sm:px-10 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4">
            <AuthBackButton />
          </div>

          {sent ? (
            <div role="status" aria-live="polite" className="text-start">
              <h1 className="font-serif text-2xl font-light tracking-wide text-neutral-950 sm:text-3xl">
                {t('auth.forgot.sent_title')}
              </h1>
              <p className="mt-3 break-words text-sm leading-relaxed text-stone-500">
                <Trans
                  i18nKey="auth.forgot.sent_text"
                  values={{ email }}
                  components={{ email: <span className="font-medium text-neutral-950" /> }}
                />
              </p>

              <div className="mt-6 space-y-3">
                <Button type="button" fullWidth={true} variant="primary" size="md" onClick={() => setSent(false)}>
                  {t('auth.forgot.use_different_email')}
                </Button>
                <Link
                  to="/login"
                  className="block text-center text-xs font-medium text-neutral-950 underline underline-offset-4 hover:text-stone-700"
                >
                  {t('auth.back_to_signin')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-4 text-start">
                <h1 className="font-serif text-2xl font-light tracking-wide text-neutral-950 sm:text-3xl">
                  {t('auth.forgot.title')}
                </h1>
                <p className="mt-1 text-xs text-stone-500">{t('auth.forgot.subtitle')}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div aria-live="polite">
                  <Input
                    label={t('auth.email_label')}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorKey) setErrorKey('')
                    }}
                    placeholder={t('auth.email_placeholder')}
                    error={errorKey ? t(errorKey) : undefined}
                  />
                </div>

                <Button type="submit" fullWidth={true} variant="primary" size="md">
                  {t('auth.forgot.submit')}
                </Button>
              </form>

              {/* Login link */}
              <div className="mt-5 border-t border-stone-100 pt-3 text-start">
                <p className="text-xs font-medium text-stone-500">
                  {t('auth.forgot.remembered')}{' '}
                  <Link
                    to="/login"
                    className="text-neutral-950 underline underline-offset-4 transition-colors hover:text-stone-700"
                  >
                    {t('auth.back_to_signin')}
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}