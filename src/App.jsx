import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CartProvider from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { LanguageProvider } from './context/LanguageContext'

import { AnnouncementBar } from './components/layout/AnnouncmentBar'
import Header from './components/layout/Header'
import { Footer } from './components/layout/Footer'

import ProtectedRoute from './routes/protectedRoutes'
import PublicRoute from './routes/publicRoutes'

import Home from './pages/Home'

const NotFound = lazy(() => import('./pages/NotFound'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))

const Shop = lazy(() => import('./pages/shop/Shop'))
const ProductDetails = lazy(() => import('./pages/shop/ProductDetails'))
const Cart = lazy(() => import('./pages/shop/Cart'))
const Checkout = lazy(() => import('./pages/shop/Checkout'))
const Wishlist = lazy(() => import('./pages/shop/Wishlist'))
const BookSetup = lazy(() => import('./pages/shop/BookSetup'))

const BlogList = lazy(() => import('./pages/blog/BlogList'))
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'))
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'))

const About = lazy(() => import('./pages/info/About'))
const Contact = lazy(() => import('./pages/info/Contact'))
const FAQ = lazy(() => import('./pages/info/FAQ'))
const Privacy = lazy(() => import('./pages/info/Privacy'))
const ShippingReturns = lazy(() => import('./pages/info/ShippingReturns'))
const Terms = lazy(() => import('./pages/info/Terms'))

// Auth 
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))

function PageLoader() {
  const { t } = useTranslation()

  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-dark" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}

const withLoader = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Routes>
              
              {/*  Public Routes (Auth Pages wrapper) */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={withLoader(<Login />)} />
                <Route path="/register" element={withLoader(<Register />)} />
                <Route path="/forget-password" element={withLoader(<ForgotPassword />)} />
                <Route path="/reset-password" element={withLoader(<ResetPassword />)} />
              </Route>

              {/* Layout Pages */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/book-setup" element={<BookSetup />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />

                {/*  Protected Routes Wrapper */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
