import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import usePaymentMethods from '../../hooks/usePaymentMethod'
import CardForm from './CardForm'
import  Button  from '../common/Button'

export default function PaymentMethods() {
  const { t } = useTranslation()
  const { cards, addCard, removeCard, setDefault } = usePaymentMethods()
  const [adding, setAdding] = useState(false)
  const [messageKey, setMessageKey] = useState('')

  const handleSave = (card, makeDefault) => {
    addCard(card, makeDefault)
    setAdding(false)
    setMessageKey('payment.saved_message')
  }

  const handleRemove = (id) => {
    removeCard(id)
    setMessageKey('payment.removed_message')
  }

  const handleDefault = (id) => {
    setDefault(id)
    setMessageKey('payment.default_message')
  }

  return (
    <section aria-label={t('payment.title')} className="max-w-2xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-gray">{t('payment.subtitle')}</p>
        {!adding && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              setAdding(true)
              setMessageKey('')
            }}
          >
            <Plus size={16} aria-hidden="true" /> {t('payment.add_card')}
          </Button>
        )}
      </div>

      <div aria-live="polite">
        {messageKey && (
          <p role="status" className="text-sm text-green-700">
            {t(messageKey)}
          </p>
        )}
      </div>

      {adding && (
        <div className="rounded-lg border border-neutral-200 p-5 sm:p-8">
          <h3 className="mb-5 font-serif text-xl tracking-wide text-brand-dark">{t('payment.form_title')}</h3>
          <CardForm
            onSave={handleSave}
            onCancel={() => setAdding(false)}
            showDefaultOption={cards.length > 0}
          />
        </div>
      )}

      {cards.length === 0 && !adding ? (
        <div className="rounded-lg border border-neutral-200 p-8 text-center">
          <p className="text-base font-medium text-brand-dark">{t('payment.empty_title')}</p>
          <p className="mt-1 text-sm text-brand-gray">{t('payment.empty_text')}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {cards.map((card) => {
            const brandName = t(`payment.brands.${card.brand}`, { defaultValue: card.brand })
            return (
              <li
                key={card.id}
                className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-brand-dark">
                    <CreditCard size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-brand-dark">
                      {t('payment.card_ending', { brand: brandName, last4: card.last4 })}
                      {card.isDefault && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-normal text-brand-dark">
                          {t('payment.default_badge')}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-brand-gray">
                      {card.holder} &middot; {t('payment.expires', { date: card.expiry })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {!card.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleDefault(card.id)}
                      aria-label={t('payment.set_default_aria', { last4: card.last4 })}
                      className="font-medium text-brand-dark underline underline-offset-4 hover:opacity-80"
                    >
                      {t('payment.set_default')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(card.id)}
                    aria-label={t('payment.remove_aria', { last4: card.last4 })}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Trash2 size={15} aria-hidden="true" /> {t('payment.remove')}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}