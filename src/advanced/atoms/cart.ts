import { atom } from 'jotai';
import type { CartItem, Notify, Product } from '../../types';
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
      notify,
    }: {
      product: Product;
      notify: Notify;
    }
  ) => {
    const cart = get(cartAtom);
    const remainingStock = productModel.getRemainingStock({
      cart,
      product,
    });
    const isSoldOut = productModel.isSoldOut({ remainingStock });
    const { message, newCart, success } = cartModel.addToCartWithStockCheck({
      cart,
      product,
      isSoldOut,
    });

    if (!success) {
      notify({ message, type: 'error' });
      return;
    }

    notify({ message, type: 'success' });
    set(cartAtom, newCart);
  }
);
