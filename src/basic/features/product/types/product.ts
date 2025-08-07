import { Discount } from "@/basic/features/discount/types/discount.type";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}
