export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

export enum DiscountType {
  AMOUNT = "amount",
  PERCENTAGE = "percentage",
}
