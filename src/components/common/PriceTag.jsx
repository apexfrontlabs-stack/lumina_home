import { themeConfig } from '@/config/themeConfig'

const SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
}

export function PriceTag({ price, salePrice, size = 'md', className = '' }) {
  const { currency, locale } = themeConfig.brand

  const format = (value) =>
    `${currency}${Number(value).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const isOnSale = salePrice !== undefined && salePrice < price

  return (
    <div className={`inline-flex items-baseline gap-2 font-sans ${SIZES[size] ?? SIZES.md} ${className}`}>
      {isOnSale ? (
        <>
          <span className="font-medium text-brand-dark">{format(salePrice)}</span>
          <del className="text-[0.8em] text-brand-gray">{format(price)}</del>
        </>
      ) : (
        <span className="font-medium text-brand-dark">{format(price)}</span>
      )}
    </div>
  )
}