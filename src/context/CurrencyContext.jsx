import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { money } from '../utils/helper'
import { CURRENCY_RATES } from '../data/productData'

const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
  const { i18n } = useTranslation()
  
  // Direct synchronized dynamic calculation method
  const getActiveCurrency = () => {
    const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
    return currentLang.split('-')[0] === 'de' ? 'EUR' : 'USD'
  }

  const [currency, setCurrency] = useState(getActiveCurrency())

  // Force sync event loop structure when language changes globally
  useEffect(() => {
    setCurrency(getActiveCurrency())
  }, [i18n.language, i18n.resolvedLanguage])

  const formatPrice = (basePriceInUSD) => {
    const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
    const activeCurrency = currentLang.split('-')[0] === 'de' ? 'EUR' : 'USD'
    
    const activeRate = CURRENCY_RATES[activeCurrency] || 1.0
    const convertedAmount = basePriceInUSD * activeRate
    
    return money(convertedAmount, activeCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
