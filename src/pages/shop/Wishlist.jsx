import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Trash2 } from 'lucide-react'
import { Container } from '../../components/common/Container'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { useCart } from '../../context/CartContext'
import useWishlist from '../../hooks/useWishlist'
import { productsData } from '../../data/productData'
import { productImage, money } from '../../utils/helper'
import { productName } from '../../utils/i18nHelper'

function WishlistCard({ product, onRemove }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const name = productName(t, product)

  const handleAdd = () => {
    addToCart({ ...product, image: productImage(product) }, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <li className="flex flex-col">
      <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-lg bg-stone-100">
        <div className="aspect-[4/5] w-full">
          <img
            src={productImage(product)}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <Link
        to={`/product/${product.id}`}
        className="mt-3 line-clamp-2 text-sm font-medium text-brand-dark hover:underline sm:text-base"
      >
        {name}
      </Link>
      <p className="mt-1 text-sm font-semibold text-brand-dark">{money(product.price)}</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-brand-dark text-sm font-medium text-brand-dark transition-colors hover:bg-brand-dark hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? (
            <>
              <Check size={16} aria-hidden="true" /> {t('product.added')}
            </>
          ) : product.inStock ? (
            t('product.add_to_cart')
          ) : (
            t('product.out_of_stock')
          )}
        </button>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={t('shop.wishlist_remove', { name })}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-neutral-300 text-red-600 hover:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

export default function Wishlist() {
  const { t } = useTranslation()
  const { ids, toggle } = useWishlist()
  const items = ids.map((id) => productsData.find((p) => p.id === id)).filter(Boolean)

  return (
    <main className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Breadcrumbs
          items={[{ label: t('header.nav.home'), href: '/' }, { label: t('header.wishlist') }]}
        />

        <h1 className="mt-6 font-serif text-3xl font-light tracking-wide text-brand-dark sm:mt-8 sm:text-4xl">
          {t('wishlist.title')}
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          {items.length === 1
            ? t('wishlist.saved_single', { total: items.length })
            : t('wishlist.saved_plural', { total: items.length })}
        </p>

        {items.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <WishlistCard key={product.id} product={product} onRemove={toggle} />
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-lg border border-neutral-200 p-10 text-center">
            <p className="text-base font-medium text-brand-dark">{t('dashboard.wishlist.empty_title')}</p>
            <p className="mt-1 text-sm text-brand-gray">{t('wishlist.empty_text')}</p>
            <Link
              to="/shop"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-brand-dark px-6 text-sm font-medium text-white hover:opacity-90"
            >
              {t('cart.browse_shop')}
            </Link>
          </div>
        )}
      </Container>
    </main>
  )
}