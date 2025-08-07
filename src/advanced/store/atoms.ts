import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Coupon, NotificationType, Product } from '../../types';
import { Coupons } from '../constants/coupons';
import { Products } from '../constants/products';

// 로컬 스토리지와 연동된 상품
export const productsAtom = atomWithStorage<Product[]>('products', Products);

// 로컬 스토리지와 연동된 쿠폰
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', Coupons);

// 로컬 스토리지와 연동된 장바구니
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 현재 선택된 쿠폰
export const selectedCouponAtom = atom<Coupon | null>(null);

// 알림 배열
export const notificationAtom = atom<NotificationType[]>([]);

// 검색어
export const seacrhTermAtom = atom<string>('');
