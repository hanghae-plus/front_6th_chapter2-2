import { Product } from "@/advanced/features/product/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}
