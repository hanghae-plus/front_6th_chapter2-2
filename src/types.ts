export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// TODO: 나중에 이 타입 다 entity로 가져가거나 해야함
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
