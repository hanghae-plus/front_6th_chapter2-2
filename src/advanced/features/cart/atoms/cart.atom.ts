import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { cartModel } from "@/advanced/features/cart/models/cart.model";
import { CartItem } from "@/advanced/features/cart/types/cart.type";
import { throwNotificationError } from "@/advanced/features/notification/utils/notificationError.util";
import productsAtom from "@/advanced/features/product/atoms/products.atom";
import { ProductWithUI } from "@/advanced/features/product/types/product";
import { PRODUCT } from "@/advanced/shared/constants/product";

const cart = atomWithStorage<CartItem[]>("cart", []);

const totalItemCount = atom((get) => {
  return get(cart).reduce((acc, item) => acc + item.quantity, 0);
});

const addToCart = atom(null, (get, set, product: ProductWithUI) => {
  const prevCart = get(cart);

  const remainingStock = cartModel.getRemainingStock(product, prevCart);
  const isOutOfStock = remainingStock <= PRODUCT.OUT_OF_STOCK_THRESHOLD;

  if (isOutOfStock) {
    throwNotificationError.error("재고가 부족합니다!");

    set(cart, prevCart);
    return;
  }

  const existingCartItem = prevCart.find(
    (item) => item.product.id === product.id
  );

  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + 1;
    const isOverStock = newQuantity > product.stock;

    if (isOverStock) {
      throwNotificationError.error(`재고는 ${product.stock}개까지만 있습니다.`);

      set(cart, prevCart);
      return;
    }

    set(
      cart,
      prevCart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    throwNotificationError.success("장바구니에 담았습니다");
    return;
  }

  set(cart, [...prevCart, { product, quantity: 1 }]);
  throwNotificationError.success("장바구니에 담았습니다");
  return;
});

const removeFromCart = atom(null, (get, set, productId: string) => {
  set(
    cart,
    get(cart).filter((item) => item.product.id !== productId)
  );
});

const updateQuantity = atom(
  null,
  (get, set, productId: string, newQuantity: number) => {
    const prevCart = get(cart);

    const isOutOfStock = newQuantity <= PRODUCT.OUT_OF_STOCK_THRESHOLD;

    if (isOutOfStock) {
      set(
        cart,
        prevCart.filter((item) => item.product.id !== productId)
      );
      return;
    }

    const product = get(productsAtom.products).find((p) => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    const isOverStock = newQuantity > maxStock;

    if (isOverStock) {
      throwNotificationError.error(`재고는 ${maxStock}개까지만 있습니다.`);

      return;
    }

    set(
      cart,
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }
);

const clearCart = atom(null, (_, set) => {
  set(cart, []);
});

export default {
  cart,
  totalItemCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
};
