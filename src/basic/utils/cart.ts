import { CartItem, Coupon, Product } from '../../types';

/**
 * 최대 적용 가능한 할인율을 계산합니다.
 * - 상품 자체 할인(discounts)
 * - 장바구니 내 대량 구매 추가 할인(5%)
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const {
    product: { discounts },
    quantity,
  } = item;

  // 상품 자체 할인 중 최대 할인율 선택
  const baseDiscount = discounts.reduce((max, discount) => {
    return quantity >= discount.quantity && discount.rate > max ? discount.rate : max;
  }, 0);

  // 장바구니에 10개 이상 담긴 상품이 하나라도 있으면 +5%
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

  return hasBulkPurchase ? Math.min(baseDiscount + 0.05, 0.5) : baseDiscount;
};

/**
 * 장바구니 아이템의 총 금액(할인 적용)을 계산합니다.
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discountRate = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discountRate));
};

/**
 * 장바구니 전체 금액(할인 전/후)을 계산합니다.
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon?: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
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
};

export interface UpdateQuantityOptions {
  allowOverStock?: boolean; // 기본 false, true 면 재고 넘어도 허용
}

/**
 * 장바구니 수량을 변경합니다. 유효성 검사를 포함하고, 새 cart 배열을 반환합니다.
 * 오류가 있는 경우 error 메시지를 함께 반환합니다.
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  product: Product,
  newQuantity: number,
  options?: UpdateQuantityOptions
): { cart: CartItem[]; error?: string } => {
  const maxStock = product.stock;

  // 음수/0 처리 – 0 이하면 아이템 제거
  if (newQuantity <= 0) {
    return { cart: cart.filter((c) => c.product.id !== product.id) };
  }

  // 재고 초과 검사
  if (!options?.allowOverStock && newQuantity > maxStock) {
    return { cart, error: `재고는 ${maxStock}개까지만 있습니다.` };
  }

  const existed = cart.find((c) => c.product.id === product.id);
  if (existed) {
    return {
      cart: cart.map((c) =>
        c.product.id === product.id ? { ...c, quantity: newQuantity } : c
      ),
    };
  }

  // 존재하지 않았다면 새로 추가
  return {
    cart: [...cart, { product, quantity: newQuantity }],
  };
};
