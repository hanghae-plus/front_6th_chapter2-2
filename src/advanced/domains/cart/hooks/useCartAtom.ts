import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useNotifications } from "../../../shared";
import { selectedCouponAtom } from "../../coupon";
import { type Product, productsAtom } from "../../product";
import { cartApplicationService } from "../services";
import { cartAtom } from "../store";
import type { CartItem } from "../types";
import { calculateItemTotal } from "../utils";

export function useCartAtom() {
  const [cart, setCart] = useAtom(cartAtom);
  const products = useAtomValue(productsAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);
  const { addNotification } = useNotifications();

  const addToCart = (product: Product) => {
    cartApplicationService.addToCart(product, cart, setCart, addNotification);
  };

  const removeFromCart = (productId: string) => {
    cartApplicationService.removeFromCart(productId, setCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    cartApplicationService.updateQuantity(
      productId,
      newQuantity,
      products,
      setCart,
      addNotification
    );
  };

  const completeOrder = () => {
    cartApplicationService.completeOrder(
      () => setCart([]),
      () => setSelectedCoupon(null),
      addNotification
    );
  };

  const calculateItemTotalWithCart = (item: CartItem) => {
    return calculateItemTotal(item, cart);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    calculateItemTotal: calculateItemTotalWithCart
  };
}
