import { getRemainingStock } from './cartCalculations';
import { Product, CartItem } from '../../types';

/**
 * 가격을 포맷팅합니다 (기존 formatPrice 함수의 로직).
 * @param price 가격
 * @param productId 상품 ID (선택사항)
 * @param products 상품 배열 (품절 상태 확인용)
 * @param cart 장바구니 (재고 계산용)
 * @param isAdmin 관리자 모드 여부
 * @returns 포맷팅된 가격 문자열
 */
export const formatPrice = (
  price: number,
  productId?: string,
  products?: Product[],
  cart?: CartItem[],
  isAdmin: boolean = false
): string => {
  if (productId && products && cart) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const remaining = getRemainingStock(product, cart);
      if (remaining <= 0) {
        return 'SOLD OUT';
      }
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

/**
 * 상품의 최대 할인율을 계산합니다.
 * @param product 상품
 * @returns 최대 할인율 (0-1 사이의 값)
 */
export const getMaxProductDiscount = (product: Product): number => {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map((d) => d.rate));
};
