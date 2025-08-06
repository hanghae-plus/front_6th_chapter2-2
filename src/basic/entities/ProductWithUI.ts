import { Product } from '../../types.ts';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}