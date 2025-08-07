import { ProductType } from '@/types';

export interface ProductWithUI extends ProductType {
  description?: string;
  isRecommended?: boolean;
}

export interface ProductFormType {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}
