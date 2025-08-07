import { atom } from 'jotai';
import type { CartItem, Product } from '../../types';
import * as cartModel from '../models/cart';
import * as productModel from '../models/product';

export const cartAtom = atom<CartItem[]>([]);

export const addCartAtom = atom(
  null,
  (
    get,
    set,
    {
      product,
    }: {
      product: Product;
    }
  ) => {
    const cart = get(cartAtom);

    const remainingStock = productModel.getRemainingStock({
      cart,
      product,
    });
    const isSoldOut = productModel.isSoldOut({ remainingStock });
    const result = cartModel.addToCartWithStockCheck({
      cart,
      product,
      isSoldOut,
    });

    if (result.success) {
      set(cartAtom, result.newCart);
    }

    return result;
  }
);

export const removeFromCartAtom = atom(
  null,
  (get, set, { productId }: { productId: string }) => {
    const cart = get(cartAtom);

    const newCart = cartModel.removeItemFromCart({ cart, productId });

    set(cartAtom, newCart);
  }
);

export const updateQuantityAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      newQuantity,
      products,
    }: { productId: string; newQuantity: number; products: Product[] }
  ) => {
    const cart = get(cartAtom);

    const result = cartModel.updateCartQuantityWithValidation({
      cart,
      newQuantity,
      productId,
      products,
    });

    if (result.success) {
      set(cartAtom, result.newCart);
    }

    return result;
  }
);
