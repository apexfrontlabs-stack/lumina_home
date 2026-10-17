const toLabel = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const keyId = (p) => String(p.id).replace(/-/g, '_')

export const productName = (t, p) =>
  t(p.nameKey ?? `products.${keyId(p)}.name`, { defaultValue: p.name ?? String(p.id) })

export const productDescription = (t, p) =>
  t(p.descriptionKey ?? `products.${keyId(p)}.description`, { defaultValue: p.description ?? '' })

export const categoryLabel = (t, slug) =>
  t(`product_categories.${slug.replace(/-/g, '_')}`, { defaultValue: toLabel(slug) })