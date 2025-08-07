import type { CartItem, Product } from '../../../../types';
import type { ProductWithUI } from '../consts';

/**
 * 상품 검색
 * @param products 상품 목록
 * @param searchTerm 검색어
 * @returns 검색 결과
 */
export function filterProducts(products: ProductWithUI[], searchTerm: string): ProductWithUI[] {
  return products.filter((product) => {
    const isIncludedSearchTermInName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isIncludedSearchTermInDescription =
      product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return isIncludedSearchTermInName || isIncludedSearchTermInDescription;
  });
}

/**
 * 남은 재고 계산
 * @param product 상품
 * @param cart 장바구니
 * @returns 남은 재고
 */
export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
}
