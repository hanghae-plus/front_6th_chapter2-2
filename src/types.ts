export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
  // description 추가
  description?: string;
}

export interface ProductForm extends Omit<Product, 'id'> {
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

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}