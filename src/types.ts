export interface Product {
  filter: any;
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
  isRecommended: boolean;
  description: string;
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
export interface NotificationType {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}
