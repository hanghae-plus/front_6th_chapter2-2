// src/basic/models/cart.ts
import { CartItem, Coupon, Discount, Product } from '../types';

// 개별 아이템의 총액 계산 (수량 * 가격)
export const calculateItemTotal = (item: CartItem): number => {
  return item.price * item.quantity;
};

// 적용 가능한 최대 할인율 계산 (보너스 할인 로직 추가)
export const getMaxApplicableDiscount = (item: CartItem): Discount => {
  const { quantity, discounts } = item;
  
  let baseDiscount: Discount = { quantity: 0, rate: 0 };
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      if (discount.rate > baseDiscount.rate) {
        baseDiscount = discount;
      }
    }
  }

  // 10개당 5% 보너스 할인 추가
  const bonusDiscountRate = Math.floor(quantity / 10) * 0.05;
  
  return {
    quantity: baseDiscount.quantity,
    rate: baseDiscount.rate + bonusDiscountRate,
  };
};

// 장바구니 전체 총액 정보 계산 (쿠폰 적용 로직 수정)
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  
  const totalDiscount = cart.reduce((total, item) => {
    const itemTotal = calculateItemTotal(item);
    const discount = getMaxApplicableDiscount(item);
    return total + (itemTotal * discount.rate);
  }, 0);

  const subtotalAfterItemDiscount = totalBeforeDiscount - totalDiscount;

  let couponDiscount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      couponDiscount = selectedCoupon.discountValue;
    } else {
      // 쿠폰은 상품 할인 후 금액에 적용
      couponDiscount = subtotalAfterItemDiscount * (selectedCoupon.discountValue / 100);
    }
  }

  const finalTotal = subtotalAfterItemDiscount - couponDiscount;

  return {
    totalBeforeDiscount,
    totalDiscount,
    couponDiscount,
    finalTotal: Math.max(0, finalTotal),
  };
};

// 장바구니에 아이템 추가 (불변성 유지)
export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
        : item
    );
  }
  return [...cart, { ...product, quantity: 1 }];
};

// 장바구니에서 아이템 제거 (불변성 유지)
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.id !== productId);
};

// 장바구니 아이템 수량 변경 (불변성 유지)
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map(item => {
    if (item.id === productId) {
      const quantity = Math.max(0, Math.min(newQuantity, item.stock));
      return { ...item, quantity };
    }
    return item;
  }).filter(item => item.quantity > 0); // 수량이 0이 되면 장바구니에서 제거
};

// 장바구니의 총 아이템 수량 계산
export const getCartTotalQuantity = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// 새로운 함수: 장바구니 비우기
export const clearCart = (): CartItem[] => {
  return [];
};
