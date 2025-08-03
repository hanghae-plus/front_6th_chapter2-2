export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: IDiscount[];
}

export interface IDiscount {
  quantity: number;
  rate: number;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICoupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface INotification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export interface IProductWithUI extends IProduct {
  description?: string;
  isRecommended?: boolean;
}
