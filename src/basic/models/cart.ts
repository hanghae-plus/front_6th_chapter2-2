import { CartItem, Coupon, Product, ProductWithUI } from '../../types';

// 적용 가능한 최대 할인율 계산 (순수 함수)
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 시 추가 5% 할인 (모든 필요한 데이터를 파라미터로 전달받음)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

// 개별 아이템의 할인 적용 후 총액 계산 (순수 함수)
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산 (순수 함수)
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
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

// 남은 재고 계산 (순수 함수)
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

// 상품을 장바구니에 추가 (순수 함수)
export const addItemToCart = (cart: CartItem[], product: ProductWithUI): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      return cart; // 재고 초과 시 기존 장바구니 반환
    }
    return cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

// 장바구니에서 상품 제거 (순수 함수)
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

// 장바구니 상품 수량 변경 (순수 함수)
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
  products: ProductWithUI[]
): CartItem[] => {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  const product = products.find((p) => p.id === productId);
  if (!product || newQuantity > product.stock) {
    return cart; // 유효하지 않은 수량이면 기존 장바구니 반환
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};
