import type { CartItem, Coupon, Product } from '../../types';
import type { ProductWithUI } from '../constants';

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 * @param item 아이템
 * @param cart 장바구니
 * @returns 할인 적용 후 총액
 */
export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
}

/**
 * 장바구니 총액 계산
 * @param cart 장바구니
 * @param selectedCoupon 선택된 쿠폰
 * @returns 할인 적용 전/후 총액
 */
export function calculateCartTotal(
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
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

/**
 * 적용 가능한 최대 할인율 계산
 * @param item 아이템
 * @param cart 장바구니
 * @returns 적용 가능한 최대 할인율
 */
function getMaxApplicableDiscount(item: CartItem, cart: CartItem[]): number {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
}

/**
 * 장바구니 아이템 수량 계산
 * @param cart 장바구니
 * @returns 장바구니 아이템 수량
 */
export function calculateItemTotalQuantity(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

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
