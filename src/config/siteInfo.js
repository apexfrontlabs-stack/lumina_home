
import { FREE_SHIPPING_OVER, SHIPPING_FEE, money } from '@/utils/helper'

export const SITE = {
  name: 'Lumina Home',
  phone: '+00 000 0000000',
  phoneHref: 'tel:+000000000000',
  email: 'info@example.com',
  address: 'Your showroom address, City, XYZ',
  country: 'XYZ',
  majorCities: 'City A, City B, City C, City D',
  get freeShippingOver() {
    return money(FREE_SHIPPING_OVER)
  },
  get standardFee() {
    return money(SHIPPING_FEE)
  },
  returnDays: 7,
}

export const LAST_UPDATED = '2026-10-01'

export const formatMonthYear = (lang) =>
  new Date(`${LAST_UPDATED}T00:00:00`).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
  })