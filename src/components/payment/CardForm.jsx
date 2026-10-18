import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import { Input } from '../common/Input'
import  Button  from '../common/Button'
import {
  cvvLengthFor,
  detectBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  validateCard,
} from '../../utils/cardUtils'

const INITIAL = { holder: '', number: '', expiry: '', cvv: '', makeDefault: false }

export default function CardForm({ onSave, onCancel, showDefaultOption = false }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const digits = digitsOnly(form.number)
  const brand = detectBrand(digits)
  const cvvLength = cvvLengthFor(brand)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validateCard(form)
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Sirf ye safe cheezein bahar jati hain: brand, aakhri 4 digits, expiry aur naam
    onSave(
      { brand, last4: digits.slice(-4), expiry: form.expiry, holder: form.holder.trim() },
      form.makeDefault
    )

    // Poora number aur CVV foran form se saaf
    setForm(INITIAL)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input
        label={t('payment.card_holder')}
        type="text"
        autoComplete="cc-name"
        value={form.holder}
        onChange={(e) => update('holder', e.target.value)}
        placeholder={t('payment.card_holder_placeholder')}
        error={errors.holder ? t(errors.holder) : undefined}
      />

      <Input
        label={t('payment.card_number')}
        labelAction={
          brand !== 'unknown' ? (
            <span className="text-xs font-medium text-brand-dark">{t(`payment.brands.${brand}`)}</span>
          ) : null
        }
        type="text"
        inputMode="numeric"
        autoComplete="cc-number"
        value={form.number}
        onChange={(e) => update('number', formatCardNumber(e.target.value))}
        placeholder={t('payment.card_number_placeholder')}
        error={errors.number ? t(errors.number) : undefined}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('payment.expiry')}
          type="text"
          inputMode="numeric"
          autoComplete="cc-exp"
          value={form.expiry}
          onChange={(e) => update('expiry', formatExpiry(e.target.value))}
          placeholder={t('payment.expiry_placeholder')}
          error={errors.expiry ? t(errors.expiry) : undefined}
        />
        <Input
          label={t('payment.cvv')}
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          value={form.cvv}
          onChange={(e) => update('cvv', digitsOnly(e.target.value).slice(0, cvvLength))}
          placeholder={t('payment.cvv_placeholder')}
          error={errors.cvv ? t(errors.cvv) : undefined}
        />
      </div>

      {showDefaultOption && (
        <label className="flex cursor-pointer items-center gap-3 text-sm text-brand-dark">
          <input
            type="checkbox"
            checked={form.makeDefault}
            onChange={(e) => update('makeDefault', e.target.checked)}
            className="h-4 w-4 accent-neutral-950"
          />
          {t('payment.make_default')}
        </label>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-brand-gray">
        <Lock size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
        {t('payment.secure_note')}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" variant="primary" size="md">
          {t('payment.save_card')}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="md" onClick={onCancel}>
            {t('payment.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}