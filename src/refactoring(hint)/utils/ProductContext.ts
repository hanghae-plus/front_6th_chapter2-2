import { CartItem, Coupon, ProductWithUI } from "@/types/product.type";
import { createContext, Dispatch, SetStateAction } from "react";

export type ProductContextType = {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
};

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
  cart: [],
  setCart: () => {},
  coupons: [],
  setCoupons: () => {},
});
