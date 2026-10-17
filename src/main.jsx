import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../src/config/i18n.js' 
import App from './App.jsx'

import { WishlistProvider } from './context/WishlistContext.jsx'
import CartProvider from './context/CartContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider> 
      <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </StrictMode>
)
