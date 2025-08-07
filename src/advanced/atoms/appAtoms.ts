import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  ProductWithUI,
  ProductFormData,
  createEmptyProductForm,
} from "../models/product";
import { initialProducts, initialCoupons } from "../constants";
import { CartItem, Coupon } from "../../types";

export type NotificationType = "error" | "success" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

/**
 * 관리자 모드 상태
 * 전역에서 관리자/사용자 페이지 전환에 사용
 */
export const isAdminAtom = atom(false);

/**
 * 검색어 상태
 */
export const searchTermAtom = atom("");

/**
 * 디바운스된 검색어 상태
 */
export const debouncedSearchTermAtom = atom<string>("");

/**
 * 상품 목록 상태
 */
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);

/**
 * 상품 폼 상태
 */
export const productFormAtom = atom<ProductFormData>(createEmptyProductForm());

/**
 * 편집 중인 상품 ID
 */
export const editingProductAtom = atom<string | null>(null);

/**
 * 장바구니 상태
 */
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

/**
 * 쿠폰 상태
 */
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

/**
 * 선택된 쿠폰 상태
 */
export const selectedCouponAtom = atom<Coupon | null>(null);

/**
 * 쿠폰 폼 표시 상태
 */
export const showCouponFormAtom = atom<boolean>(false);

/**
 * 알림 목록 상태
 */
export const notificationsAtom = atom<Notification[]>([]);
