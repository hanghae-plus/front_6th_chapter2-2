import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { ProductWithUI, Coupon, CartItem, Notification } from '../../types';
import { initialProducts, initialCoupons } from '../constants';
import { calculateItemTotal } from '../models/cart';

// LocalStorage와 동기화되는 Atom들 (기존 useLocalStorage 대체)
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 일반 메모리 Atom들 (기존 useState 대체)
export const notificationsAtom = atomWithStorage<Notification[]>('notifications', []);
export const isAdminAtom = atomWithStorage<boolean>('isAdmin', false, {
  getItem: () => false, // 새로고침 시 항상 false 반환
  setItem: () => {}, // localStorage에 저장하지 않음
  removeItem: () => {}, // localStorage에서 제거하지 않음
});
export const selectedCouponAtom = atom<Coupon | null>(null);
export const searchTermAtom = atomWithStorage<string>('searchTerm', '');

// 파생(Derived) Atom들 (기존 계산 로직 대체)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);

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
});

// 검색된 상품 필터링
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);

  if (!searchTerm.trim()) return products;

  return products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
