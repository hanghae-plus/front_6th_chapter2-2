import { CartItem, Product } from '../../types';

// 장바구니 비즈니스 로직 (순수 함수)

// 적용 가능한 최대 할인율 계산
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 시 추가 5% 할인 (장바구니에 어떤 상품이라도 10개 이상이 있으면)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

// 개별 아이템의 할인 적용 후 총액 계산
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 남은 재고 계산
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

// 장바구니 아이템의 원래 가격 계산
export const calculateOriginalPrice = (item: CartItem): number => {
  return item.product.price * item.quantity;
};
