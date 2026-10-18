import i18n from '../config/i18n'

export const productImage = (product, n = 1) =>
  `${import.meta.env.BASE_URL}furniture-store/images/products/${product.category}/${n}.webp`

const LOCALES = { en: 'en-US', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN' }

const CURRENCY_MAP = {
  en: 'USD',
  de: 'EUR',
  fr: 'EUR',
  zh: 'CNY',
}

export const currentLocale = () => {
  const lang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  return LOCALES[lang] ?? 'en-US'
}

export const money = (n, currentCurrency) => {
  const lang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]

  const fallbackCurrency = CURRENCY_MAP[lang] || 'USD'
  const finalCurrency = currentCurrency || fallbackCurrency

  return new Intl.NumberFormat(currentLocale(), {
    style: 'currency',
    currency: finalCurrency,
    maximumFractionDigits: 0,
  }).format(n)
}

export const FREE_SHIPPING_OVER = 50000
export const SHIPPING_FEE = 50

export const calcShipping = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE