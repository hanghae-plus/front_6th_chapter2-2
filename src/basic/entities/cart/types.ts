import type { Product } from "@entities/product";

export interface Cart {
  product: Product;
  quantity: number;
}
