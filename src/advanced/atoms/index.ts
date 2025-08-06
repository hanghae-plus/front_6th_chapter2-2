import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../entities/products/product.types";
import { CartItem } from "../../types";
import { CouponWithUI } from "../entities/coupon/coupon.types";
import { initialProducts } from "../entities/products/product.constants";
import { initialCoupons } from "../entities/coupon/coupon.constants";

// Notification 타입 정의
export type NotificationType = "error" | "success" | "warning";
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

// ============= localStorage와 연동되는 핵심 상태들 =============
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);
export const couponsAtom = atomWithStorage<CouponWithUI[]>(
  "coupons",
  initialCoupons
);

// ============= 메모리 상태들 =============
export const selectedCouponAtom = atom<CouponWithUI | null>(null);
export const isAdminAtom = atom<boolean>(false);
export const notificationsAtom = atom<Notification[]>([]);
export const searchTermAtom = atom<string>("");

// ============= 폼 관련 상태들 =============
export const showProductFormAtom = atom<boolean>(false);
export const showCouponFormAtom = atom<boolean>(false);
export const editingProductAtom = atom<string | null>(null);

export const productFormAtom = atom<{
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}>({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});

export const couponFormAtom = atom<{
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}>({
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
});
