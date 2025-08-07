import { Product } from './product.ts';

export interface CartItem {
  product: Product;
  quantity: number;
}
