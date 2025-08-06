import { NOTIFICATION } from "@/basic/shared/constants/notification";

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

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

export enum DiscountType {
  AMOUNT = "amount",
  PERCENTAGE = "percentage",
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export type NotificationType =
  (typeof NOTIFICATION.TYPES)[keyof typeof NOTIFICATION.TYPES];
