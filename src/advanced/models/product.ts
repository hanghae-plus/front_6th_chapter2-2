import { ProductWithUI } from '../types'

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
