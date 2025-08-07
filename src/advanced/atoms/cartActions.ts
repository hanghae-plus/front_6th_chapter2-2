import { atom } from "jotai";
import { Product, Coupon } from "../../types";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getRemainingStock,
  calculateTotalItemCount,
  calculateCartTotal,
  generateOrderNumber,
  isStockExceeded,
  findCartItemByProductId,
} from "../models/cart";
import { findProductById } from "../models/product";
import { cartAtom } from "./appAtoms";
import {
  addSuccessNotificationActionAtom,
  addErrorNotificationActionAtom,
} from "./notificationActions";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";

export const addToCartActionAtom = atom(
  null,
  (get, set, { product }: { product: Product }) => {
    const cart = get(cartAtom);
    const remainingStock = getRemainingStock(product, cart);

    if (remainingStock <= 0) {
      set(addErrorNotificationActionAtom, ERROR_MESSAGES.STOCK_INSUFFICIENT);
      return;
    }

    const newCart = addItemToCart(cart, product);
    const addedItem = findCartItemByProductId(newCart, product.id);

    if (addedItem && isStockExceeded(addedItem.quantity, product.stock)) {
      set(
        addErrorNotificationActionAtom,
        ERROR_MESSAGES.STOCK_EXCEEDED(product.stock)
      );
      return;
    }

    set(cartAtom, newCart);
    set(addSuccessNotificationActionAtom, SUCCESS_MESSAGES.ITEM_ADDED_TO_CART);
  }
);

export const removeFromCartActionAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    set(cartAtom, removeItemFromCart(cart, productId));
  }
);

export const updateQuantityActionAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      newQuantity,
      products,
    }: {
      productId: string;
      newQuantity: number;
      products: Product[];
    }
  ) => {
    const cart = get(cartAtom);

    if (newQuantity <= 0) {
      set(cartAtom, removeItemFromCart(cart, productId));
      return;
    }

    const product = findProductById(products, productId);
    if (!product) return;

    if (isStockExceeded(newQuantity, product.stock)) {
      set(
        addErrorNotificationActionAtom,
        ERROR_MESSAGES.STOCK_EXCEEDED(product.stock)
      );
      return;
    }

    set(cartAtom, updateCartItemQuantity(cart, productId, newQuantity));
  }
);

export const completeOrderActionAtom = atom(null, (_get, set) => {
  const orderNumber = generateOrderNumber(Date.now());
  set(
    addSuccessNotificationActionAtom,
    SUCCESS_MESSAGES.ORDER_COMPLETED(orderNumber)
  );
  set(cartAtom, []);
});

export const cartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return calculateTotalItemCount(cart);
});

export const cartTotalAtom = atom(
  (get) => {
    const cart = get(cartAtom);
    return cart;
  },
  (get, _set, coupon?: Coupon | null) => {
    const cart = get(cartAtom);
    return calculateCartTotal(cart, coupon || null);
  }
);
