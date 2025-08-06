type CouponDiscountType = "amount" | "percentage";

type NotificationType = "error" | "success" | "warning";

export interface IDiscount {
  quantity: number;
  rate: number;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: IDiscount[];
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICoupon {
  name: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
}

export interface INotification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface IProductWithUI extends IProduct {
  description?: string;
  isRecommended?: boolean;
}

export interface IProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{
    quantity: number;
    rate: number;
  }>;
}

export interface ICouponForm {
  name: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
}
