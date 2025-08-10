import { CartItem, Product } from "../../types";
import { VALIDATION_LIMITS } from "../utils/constants";

export const cartModel = {
  findItem: ({
    cart,
    productId,
  }: {
    cart: CartItem[];
    productId: string;
  }): CartItem | undefined =>
    cart.find((item) => item.product.id === productId),

  getItemQuantity: ({
    cart,
    productId,
  }: {
    cart: CartItem[];
    productId: string;
  }): number => {
    const item = cartModel.findItem({ cart, productId });
    return item ? item.quantity : 0;
  },

  addNewItem: ({
    cart,
    product,
  }: {
    cart: CartItem[];
    product: Product;
  }): CartItem[] => [
    ...cart,
    { product, quantity: VALIDATION_LIMITS.CART.DEFAULT_QUANTITY },
  ],

  updateItemQuantity: ({
    cart,
    productId,
    newQuantity,
  }: {
    cart: CartItem[];
    productId: string;
    newQuantity: number;
  }): CartItem[] =>
    cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ),

  removeItem: ({
    cart,
    productId,
  }: {
    cart: CartItem[];
    productId: string;
  }): CartItem[] => cart.filter((item) => item.product.id !== productId),

  isEmpty: (cart: CartItem[]): boolean => cart.length === 0,
};
export default cartModel;
