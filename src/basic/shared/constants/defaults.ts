import { DiscountType } from "@/types";

const PRODUCT_FORM = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [] as Array<{ quantity: number; rate: number }>,
};

const COUPON_FORM = {
  name: "",
  code: "",
  discountType: DiscountType.AMOUNT,
  discountValue: 0,
};

const QUANTITY = 1;

const TOTAL = 0;

export const DEFAULTS = {
  PRODUCT_FORM,
  COUPON_FORM,
  QUANTITY,
  TOTAL,
} as const;
