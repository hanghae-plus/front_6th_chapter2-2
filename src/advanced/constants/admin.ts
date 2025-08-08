import { CouponFormState, ProductFormState } from "../types/admin";

// 초기값 상수들
export const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export const INITIAL_COUPON_FORM: CouponFormState = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

// 검증 관련 상수들
export const VALIDATION_LIMITS = {
  MAX_STOCK: 9999,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MAX_DISCOUNT_AMOUNT: 100000,
  MIN_VALUE: 0,
} as const;

// 관리자 탭 정보
export const ADMIN_TABS = {
  PRODUCTS: "products" as const,
  COUPONS: "coupons" as const,
  INVENTORY: "inventory" as const,
} as const;

export const ADMIN_TAB_LABELS = {
  [ADMIN_TABS.PRODUCTS]: "상품 관리",
  [ADMIN_TABS.COUPONS]: "쿠폰 관리",
  [ADMIN_TABS.INVENTORY]: "재고 관리",
} as const;
