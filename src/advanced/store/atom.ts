import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ICartItem, ICoupon, INotification, IProductWithUI } from "../type";
import {
  initialCarts,
  initialProducts,
  initialCoupons,
} from "../constants/initialStates";

// 로컬 스토리지와 연동된 상품
export const productsAtom = atomWithStorage<IProductWithUI[]>(
  "products",
  initialProducts
);

// 로컬 스토리지와 연동된 쿠폰
export const couponsAtom = atomWithStorage<ICoupon[]>(
  "coupons",
  initialCoupons
);

// 로컬 스토리지와 연동된 장바구니
export const cartAtom = atomWithStorage<ICartItem[]>("cart", initialCarts);

// 현재 선택된 쿠폰
export const selectedCouponAtom = atom<ICoupon | null>(null);

// 알림 배열
export const notificationAtom = atom<INotification[]>([]);

// 검색어
export const seacrhTermAtom = atom<string>("");
