import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { calculateCartTotal } from '../models/cart';
import { CartItem, Coupon, Product, ProductWithUI } from '../types';
import { addNotificationAtom } from './notificationAtoms';
import { productsAtom } from './productAtoms';

// localStorage와 동기화되는 cart atom
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 선택된 쿠폰 atom
export const selectedCouponAtom = atom<Coupon | null>(null);

// 재고 확인 함수 (derived atom)
export const getRemainingStockAtom = atom((get) => (product: Product): number => {
  const cart = get(cartAtom);
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
});

// 총액 계산 (derived atom)
export const calculateTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

// 총액 정보 (PaymentInfo용)
export const totalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

// 장바구니에 상품 추가 (비즈니스 로직 포함)
export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const currentCart = get(cartAtom);
  const getRemainingStock = get(getRemainingStockAtom);

  const remainingStock = getRemainingStock(product);
  if (remainingStock <= 0) {
    set(addNotificationAtom, {
      id: Date.now().toString(),
      message: '재고가 부족합니다!',
      type: 'error',
    });
    return;
  }

  const existingItem = currentCart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      set(addNotificationAtom, {
        id: Date.now().toString(),
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        type: 'error',
      });
      return;
    }

    const updatedCart = currentCart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
    );
    set(cartAtom, updatedCart);
  } else {
    set(cartAtom, [...currentCart, { product, quantity: 1 }]);
  }

  set(addNotificationAtom, {
    id: Date.now().toString(),
    message: '장바구니에 담았습니다',
    type: 'success',
  });
});

// 장바구니에서 상품 제거
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const currentCart = get(cartAtom);
  const filteredCart = currentCart.filter((item) => item.product.id !== productId);
  set(cartAtom, filteredCart);
});

// 수량 업데이트 (비즈니스 로직 포함)
export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }: { productId: string; quantity: number }) => {
    const currentCart = get(cartAtom);
    const products = get(productsAtom);

    if (quantity <= 0) {
      // 수량이 0 이하면 장바구니에서 제거
      const filteredCart = currentCart.filter((item) => item.product.id !== productId);
      set(cartAtom, filteredCart);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (quantity > maxStock) {
      set(addNotificationAtom, {
        id: Date.now().toString(),
        message: `재고는 ${maxStock}개까지만 있습니다.`,
        type: 'error',
      });
      return;
    }

    const updatedCart = currentCart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
    set(cartAtom, updatedCart);
  },
);

// 수량 업데이트 (CartList에서 사용할 alias)
export const updateCartItemQuantityAtom = updateQuantityAtom;

// 장바구니 비우기
export const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, []);
  set(selectedCouponAtom, null);
});

// 쿠폰 적용 (비즈니스 로직 포함)
export const applyCouponAtom = atom(null, (get, set, coupon: Coupon | null) => {
  if (!coupon) {
    set(selectedCouponAtom, null);
    return;
  }

  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

  if (currentTotal < 10000 && coupon.discountType === 'percentage') {
    set(addNotificationAtom, {
      id: Date.now().toString(),
      message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
      type: 'error',
    });
    return;
  }

  set(selectedCouponAtom, coupon);
  set(addNotificationAtom, {
    id: Date.now().toString(),
    message: '쿠폰이 적용되었습니다.',
    type: 'success',
  });
});

// 주문 완료
export const completeOrderAtom = atom(null, (get, set) => {
  const cart = get(cartAtom);

  if (cart.length === 0) {
    set(addNotificationAtom, {
      id: Date.now().toString(),
      message: '장바구니가 비어있습니다.',
      type: 'error',
    });
    return;
  }

  // 장바구니 비우기
  set(clearCartAtom);

  set(addNotificationAtom, {
    id: Date.now().toString(),
    message: '주문이 완료되었습니다!',
    type: 'success',
  });
});

// 총 아이템 개수 (derived atom)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});
