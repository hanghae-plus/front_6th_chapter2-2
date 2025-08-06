import { DiscountType } from "@/basic/features/discount/types/discount.type";

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}
