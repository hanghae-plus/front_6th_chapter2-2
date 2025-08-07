export interface ProductType {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: DiscountType[];
}

export interface DiscountType {
  quantity: number;
  rate: number;
}

export interface CartItemType {
  product: ProductType;
  quantity: number;
}

export interface CouponType {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
