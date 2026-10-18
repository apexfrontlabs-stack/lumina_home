export const digitsOnly = (value) =>
  String(value ?? '').replace(/\D/g, '')

const inRange = (digits, from, to) => {
  const prefixLength = String(from).length

  if (digits.length < prefixLength) return false

  const prefix = Number(digits.slice(0, prefixLength))

  return prefix >= from && prefix <= to
}

export function detectBrand(digits) {
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^4/.test(digits)) return 'visa'

  if (
    inRange(digits, 51, 55) ||
    inRange(digits, 2221, 2720)
  ) {
    return 'mastercard'
  }

  if (/^62/.test(digits)) return 'unionpay'

  if (/^(6011|65|64[4-9])/.test(digits)) return 'discover'

  return 'unknown'
}

export const cvvLengthFor = (brand) =>
  brand === 'amex' ? 4 : 3

export function passesLuhn(digits) {
  if (!/^\d+$/.test(digits)) return false

  let sum = 0
  let double = false

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])

    if (double) {
      digit *= 2

      if (digit > 9) digit -= 9
    }

    sum += digit
    double = !double
  }

  return sum % 10 === 0
}

export function formatCardNumber(value) {
  const digits = digitsOnly(value)
  const brand = detectBrand(digits)

  if (brand === 'amex') {
    const limited = digits.slice(0, 15)

    return [
      limited.slice(0, 4),
      limited.slice(4, 10),
      limited.slice(10, 15),
    ]
      .filter(Boolean)
      .join(' ')
  }

  return digits
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
}

export function formatExpiry(value) {
  const digits = digitsOnly(value).slice(0, 4)

  if (digits.length === 1 && Number(digits) > 1) {
    return `0${digits}`
  }

  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return digits
}

export function validateCard(form, now = new Date()) {
  const errors = {}
  const holder = String(form.holder ?? '').trim()
  const digits = digitsOnly(form.number)
  const brand = detectBrand(digits)
  const expiry = String(form.expiry ?? '').trim()
  const cvv = digitsOnly(form.cvv)

  if (!holder) {
    errors.holder = 'payment.errors.holder_required'
  }

  if (!digits) {
    errors.number = 'payment.errors.number_required'
  } else {
    const supportedBrand = brand !== 'unknown'
    const validLength =
      brand === 'amex'
        ? digits.length === 15
        : brand === 'visa'
          ? [13, 16, 19].includes(digits.length)
          : brand === 'mastercard'
            ? digits.length === 16
            : brand === 'discover'
              ? [16, 19].includes(digits.length)
              : brand === 'unionpay'
                ? digits.length >= 16 && digits.length <= 19
                : false

    const validNumber =
      brand === 'unionpay' || passesLuhn(digits)

    if (!supportedBrand || !validLength || !validNumber) {
      errors.number = 'payment.errors.number_invalid'
    }
  }

  if (!expiry) {
    errors.expiry = 'payment.errors.expiry_required'
  } else {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry)

    if (!match) {
      errors.expiry = 'payment.errors.expiry_invalid'
    } else {
      const month = Number(match[1])
      const year = 2000 + Number(match[2])
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        errors.expiry = 'payment.errors.expiry_past'
      }
    }
  }

  if (!cvv) {
    errors.cvv = 'payment.errors.cvv_required'
  } else if (
    !/^\d+$/.test(cvv) ||
    cvv.length !== cvvLengthFor(brand)
  ) {
    errors.cvv = 'payment.errors.cvv_invalid'
  }

  return errors
}