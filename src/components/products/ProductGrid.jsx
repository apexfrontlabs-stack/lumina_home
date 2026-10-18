
import { ProductCardSkeleton } from '../common/ProductCardSkeleton'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  products = [],
  loading = false,
  onAddToCart,
  className = '',
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 ${className}`}
      aria-busy={loading}
    >
      {loading
        ? Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        : products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
    </div>
  )
}
