import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { calculateCartTotal } from '../utils/calculators';
import { selectedCouponAtom } from './couponAtoms';
import { productsAtom } from './productAtoms';
import { cartService } from '../services/cartService';
import { validateCartOperation } from '../utils/validators';
import { notificationsAtom } from './notificationAtoms';
import { ProductWithUI } from '../types';

export interface CartItem {
  product: ProductWithUI;
  quantity: number;
}

// localStorage와 연동되는 atom
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 파생 atom: 장바구니 총 아이템 개수
export const totalItemCountAtom = atom(get => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});

// 파생 atom: 장바구니 총액 계산 (할인 포함)
export const cartTotalsAtom = atom(get => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

// 액션 atom: 장바구니에 상품 추가 (알림 포함)
export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const cart = get(cartAtom);
  const products = get(productsAtom);
  const notifications = get(notificationsAtom);

  const currentProduct = products.find(p => p.id === product.id);
  if (!currentProduct) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  // 재고 검증
  const stockValidation = validateCartOperation.validateStockAvailability(
    currentProduct,
    cart
  );

  if (!stockValidation.isValid) {
    throw new Error(stockValidation.message);
  }

  // 장바구니에 추가
  const newCart = cartService.addItemToCart(currentProduct, cart);
  set(cartAtom, newCart);

  // 알림 추가
  const id = Date.now();
  set(notificationsAtom, [
    ...notifications,
    { id, message: '장바구니에 담았습니다', type: 'success' },
  ]);

  // 3초 후 알림 제거
  setTimeout(() => {
    const currentNotifications = get(notificationsAtom);
    set(
      notificationsAtom,
      currentNotifications.filter(n => n.id !== id)
    );
  }, 3000);
});
