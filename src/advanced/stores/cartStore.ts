import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Product } from "../../types";
import { calculateTotalItemCount, getRemainingStock as getRemainingStockModel } from "../models/cart";
import { InsufficientStockError, StockExceededError } from "../errors/Cart.error";
import { ProductNotFoundError } from "../errors/Product.error";

// 장바구니 상태 atom (localStorage와 연동)
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

// 총 아이템 개수 계산 atom
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return calculateTotalItemCount(cart);
});

// 장바구니에 상품 추가하는 atom
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const cart = get(cartAtom);
  const remainingStock = getRemainingStockModel(product, cart);

  if (remainingStock <= 0) {
    throw new InsufficientStockError(product.name, remainingStock);
  }

  set(cartAtom, (prevCart) => {
    const existingItem = prevCart.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;

      if (newQuantity > product.stock) {
        throw new StockExceededError(product.name, product.stock, newQuantity);
      }

      return prevCart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
    }

    return [...prevCart, { product, quantity: 1 }];
  });
});

// 장바구니에서 상품 제거하는 atom
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  set(cartAtom, (prevCart) => prevCart.filter((item) => item.product.id !== productId));
});

// 수량 업데이트하는 atom
export const updateQuantityAtom = atom(
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
    if (newQuantity <= 0) {
      set(removeFromCartAtom, productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      throw new StockExceededError(product.name, maxStock, newQuantity);
    }

    set(cartAtom, (prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  }
);

// 장바구니 비우는 atom
export const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, []);
});

// 남은 재고 계산하는 atom
export const getRemainingStockAtom = atom((get) => (product: Product) => {
  const cart = get(cartAtom);
  return getRemainingStockModel(product, cart);
});
