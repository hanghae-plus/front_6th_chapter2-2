import { Product } from "@/basic/features/product/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}
