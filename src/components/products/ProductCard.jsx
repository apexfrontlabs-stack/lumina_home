import { useTranslation } from 'react-i18next'
import { ShoppingBag } from 'lucide-react'
import { Badge } from '../common/Badge'
import { PriceTag } from '../common/PriceTag'
import { RatingStars } from '../common/RatingStars'
import { WishlistButton } from '../common/Whishlist'
import { productImage } from '../../utils/helper'

export function ProductCard({ product, onAddToCart, className = '' }) {
  const { t } = useTranslation()
  const {
    id,
    name,
    nameKey,
    category,
    image,
    hoverImage,
    imagesCount,
    price,
    salePrice,
    rating,
    reviews,
    reviewCount,
    badge,
  } = product
  const soldOut = badge === 'soldout'

  // Naam nameKey se; key na mile to original text, crash nahi hoga
  const translatedName = t(nameKey ?? `products.${String(id).replace(/-/g, '_')}.name`, {
    defaultValue: name ?? String(id),
  })
  const translatedCategory = t(`product_categories.${String(category).replace(/-/g, '_')}`, {
    defaultValue: category,
  })

  // productsData mein image field nahi hai, to helper se banti hai
  const mainImage = image ?? productImage(product)
  const secondImage = hoverImage ?? (imagesCount > 1 ? productImage(product, 2) : undefined)

  return (
    <article className={`group font-sans ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img
          src={mainImage}
          alt={translatedName}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {secondImage && (
          <img
            src={secondImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {badge && <Badge variant={badge} className="absolute left-3 top-3" />}
        <WishlistButton className="absolute right-3 top-3" />

        {!soldOut && (
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-brand-dark py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-300 md:translate-y-full md:group-hover:translate-y-0"
          >
            <ShoppingBag size={14} aria-hidden="true" /> {t('product.add_to_cart')}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-[11px] uppercase tracking-widest text-brand-gray">{translatedCategory}</p>
        <h3 className="text-sm font-medium text-brand-dark">{translatedName}</h3>
        {rating !== undefined && (
          <RatingStars rating={rating} count={reviews ?? reviewCount} size={12} />
        )}
        <PriceTag price={price} salePrice={salePrice} size="sm" />
      </div>
    </article>
  )
}