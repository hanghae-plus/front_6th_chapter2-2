import { Product } from '../../../types';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}
