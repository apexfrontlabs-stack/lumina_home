import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { layoutAssetsData } from '../../data/layoutData'
import { Input } from '../../components/common/Input'
import  Button  from '../../components/common/Button'
import AuthBackButton from '../../components/common/AuthBackButton'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = {}
    if (!email.trim()) validationErrors.email = 'auth.errors.email_required'
    if (!password) validationErrors.password = 'auth.errors.password_required'

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
    } else {
      setErrors({})
      console.log('Login validated:', { email })
    }
  }

  return (
    <div className="flex h-screen w-screen max-w-full overflow-hidden bg-white lg:flex-row">
      <div className="relative hidden h-full w-1/2 shrink-0 overflow-hidden bg-stone-100 lg:block">
        <img
          src={layoutAssetsData.auth.background}
          alt={t('auth.image_alt')}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[7000ms] lg:hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-neutral-950/10 mix-blend-multiply" />
      </div>

      {/* Form */}
      <div className="flex h-full w-full flex-col justify-center overflow-hidden px-5 py-6 sm:px-10 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4">
            <AuthBackButton />
          </div>

          <div className="mb-4 text-start">
            <h1 className="font-serif text-2xl font-light tracking-wide text-neutral-950 sm:text-3xl">
              {t('auth.login.title')}
            </h1>
            <p className="mt-1 text-xs text-stone-500">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label={t('auth.email_label')}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email_placeholder')}
              error={errors.email ? t(errors.email) : undefined}
            />

            <Input
              label={t('auth.password_label')}
              labelAction={
                <Link
                  to="/forget-password"
                  className="text-xs text-stone-400 transition-colors hover:text-neutral-950"
                >
                  {t('auth.login.forgot_password')}
                </Link>
              }
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password ? t(errors.password) : undefined}
            />

            <Button type="submit" fullWidth={true} variant="primary" size="md">
              {t('auth.login.submit')}
            </Button>
          </form>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-stone-100"></div>
            <span className="mx-3 flex-shrink text-[10px] font-medium uppercase tracking-widest text-stone-400">
              {t('auth.login.or_continue')}
            </span>
            <div className="flex-grow border-t border-stone-100"></div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <Button type="button" variant="google">Google</Button>
            <Button type="button" variant="facebook">Facebook</Button>
          </div>

          <div className="border-t border-stone-100 pt-3 text-start">
            <p className="text-xs font-medium text-stone-500">
              {t('auth.login.new_to')}{' '}
              <Link
                to="/register"
                className="text-neutral-950 underline underline-offset-4 transition-colors hover:text-stone-700"
              >
                {t('auth.login.create_account')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}