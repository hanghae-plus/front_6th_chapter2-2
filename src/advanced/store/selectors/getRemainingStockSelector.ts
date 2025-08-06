import { atom } from "jotai";
import { productsAtom } from "../atoms/productAtoms";
import { cartAtom } from "../atoms/cartAtoms";
import { Getter } from "jotai";

// 상품별 남은 재고 selector
export const getRemainingStockAtom = atom(
  (get: Getter) => (productId: string) => {
    const products = get(productsAtom);
    const cart = get(cartAtom);
    const product = products.find((p) => p.id === productId);
    const cartItem = cart.find((item) => item.product.id === productId);
    const stock = product ? product.stock : 0;
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    return stock - quantityInCart;
  }
);
