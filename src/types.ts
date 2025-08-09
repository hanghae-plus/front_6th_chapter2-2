export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
  description?: string;
  isRecommended?: boolean;
}

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
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

export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}
