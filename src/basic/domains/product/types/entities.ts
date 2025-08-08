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

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}
