export interface Cart {
  id: string;
  name: string;
  price: number;
  discounts: Discount[];
  quantity: number;
}

export interface Discount {
  quantity: number;
  rate: number;
}
