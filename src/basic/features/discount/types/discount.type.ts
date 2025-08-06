export interface Discount {
  quantity: number;
  rate: number;
}

export enum DiscountType {
  AMOUNT = "amount",
  PERCENTAGE = "percentage",
}
