import { Product } from '../../../types';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export type { ProductWithUI, Notification };
