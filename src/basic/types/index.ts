// src/basic/types/index.ts

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

export interface CartItem extends Product {
  quantity: number;
}

export type Coupon = {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
};
