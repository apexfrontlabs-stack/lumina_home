import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { SectionTitle } from '../common/SectionTitle'
import { Input } from '../common/Input'
import { Button } from '../common/Button'

export function Newsletter({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(email)
    setSent(true)
    setEmail('')
  }

  return (
    <section className="bg-neutral-100 py-20">
      <Container>
        <SectionTitle
          eyebrow={t('newsletter.eyebrow')}
          title={t('newsletter.title')}
          subtitle={t('newsletter.subtitle')}
        />
        {sent ? (
          <p className="mt-8 text-center font-sans text-sm text-brand-dark">{t('newsletter.thank_you')}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              aria-label={t('newsletter.email_label')}
              placeholder={t('newsletter.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">{t('newsletter.subscribe')}</Button>
          </form>
        )}
      </Container>
    </section>
  )
}