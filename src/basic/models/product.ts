export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export const initialProductForm: ProductForm = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};
