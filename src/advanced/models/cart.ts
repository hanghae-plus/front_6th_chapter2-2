import { CartItem, Coupon, Product } from "../../types";
import { calculateItemTotalWithDiscount } from "./discount";
import { calculateCouponDiscount } from "./coupon";

// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  return calculateItemTotalWithDiscount(item, cart);
};

// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discountAmount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  totalBeforeDiscount = Math.round(totalBeforeDiscount);
  totalAfterDiscount = Math.round(totalAfterDiscount);

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    totalAfterDiscount = calculateCouponDiscount(totalAfterDiscount, selectedCoupon);
  }

  const discountAmount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    discountAmount,
  };
};

// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
export const updateCartItemQuantity = (cart: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
};

// 5. addItemToCart(cart, product): 상품 추가
export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + 1);
  }

  return [...cart, { product, quantity: 1 }];
};

// 6. removeItemFromCart(cart, productId): 상품 제거
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

// 7. getRemainingStock(product, cart): 남은 재고 계산
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  return Math.max(0, product.stock - quantityInCart);
};

// 장바구니 총 아이템 개수 계산
export const calculateTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// 아이템별 할인 정보 계산 (discount.ts에서 가져온 함수 사용)
export { calculateItemDiscount } from "./discount";
