import type { CartItem } from "../../cart/types";
import { getRemainingStock } from "../../cart/utils";
import type { ProductWithUI } from "../types";

export function formatPrice(
  price: number,
  productId?: string,
  products?: ProductWithUI[],
  cart?: CartItem[],
  isAdmin?: boolean
) {
  if (productId && products && cart) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product, cart) <= 0) {
      return "SOLD OUT";
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
}

export function filterProducts(products: ProductWithUI[], searchTerm: string) {
  if (!searchTerm) return products;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
  );
}
