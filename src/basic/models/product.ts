import { ProductWithUI } from '../types'

export const isRecommendedProduct = (product: ProductWithUI) => {
  return product.isRecommended
}

export const isStock = (product: ProductWithUI) => {
  return product.stock > 0
}

export const isDiscounts = (product: ProductWithUI) => {
  return product.discounts.length > 0
}

export const getMaxDiscountRate = (product: ProductWithUI) => {
  if (product.discounts.length === 0) return 0
  const rates = product.discounts.map((item) => item.rate)
  return Math.max(...rates)
}

export const isRemainingRange = (
  min: number,
  max: number,
  remainingStock: number,
) => {
  return remainingStock <= max && remainingStock > min
}

export const isOutOfStock = (remainingStock: number) => {
  return remainingStock <= 0
}

export const getFilteredProducts = (
  searchTerm: string,
  products: ProductWithUI[],
) => {
  if (!searchTerm) return products

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}
