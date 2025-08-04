/**
 * 기본값 상수들
 */

/** 상품 폼 기본값 */
export const DEFAULT_PRODUCT_FORM = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [] as Array<{ quantity: number; rate: number }>,
};

/** 쿠폰 폼 기본값 */
export const DEFAULT_COUPON_FORM = {
  name: "",
  code: "",
  discountType: "amount" as "amount" | "percentage",
  discountValue: 0,
};

/** 기본 수량값 */
export const DEFAULT_QUANTITY = 1;

/** 기본 합계값 */
export const DEFAULT_TOTAL = 0;
