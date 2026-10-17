import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { layoutAssetsData } from '../../data/layoutData'
import { Input } from '../../components/common/Input'
import  Button  from '../../components/common/Button'
import AuthBackButton from '../../components/common/AuthBackButton'

export default function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!password) next.password = 'auth.errors.new_password_required'
    else if (password.length < 8) next.password = 'auth.errors.password_min'
    if (!confirmPassword) next.confirmPassword = 'auth.errors.confirm_required'
    else if (confirmPassword !== password) next.confirmPassword = 'auth.errors.passwords_mismatch'

    setErrors(next)
    if (Object.keys(next).length === 0) {
      setDone(true)
    }
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

          {done ? (
            <div role="status" aria-live="polite" className="text-start">
              <h1 className="font-serif text-2xl font-light tracking-wide text-neutral-950 sm:text-3xl">
                {t('auth.reset.done_title')}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{t('auth.reset.done_text')}</p>
              <div className="mt-6">
                <Button
                  type="button"
                  fullWidth={true}
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/login')}
                >
                  {t('auth.reset.go_to_signin')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-4 text-start">
                <h1 className="font-serif text-2xl font-light tracking-wide text-neutral-950 sm:text-3xl">
                  {t('auth.reset.title')}
                </h1>
                <p className="mt-1 text-xs text-stone-500">{t('auth.reset.subtitle')}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label={t('auth.reset.new_password')}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
                  }}
                  placeholder={t('auth.register.password_placeholder')}
                  error={errors.password ? t(errors.password) : undefined}
                />

                <Input
                  label={t('auth.reset.confirm_new_password')}
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }))
                  }}
                  placeholder={t('auth.reset.confirm_placeholder')}
                  error={errors.confirmPassword ? t(errors.confirmPassword) : undefined}
                />

                <Button type="submit" fullWidth={true} variant="primary" size="md">
                  {t('auth.reset.submit')}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-5 border-t border-stone-100 pt-3 text-start">
                <p className="text-xs font-medium text-stone-500">
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