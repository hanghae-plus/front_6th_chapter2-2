import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Product } from "../../types";
import * as cartModel from "../../models/cart";
import * as productModel from "../../models/product";
import * as composedModels from "../../models";
import { validateCartStock } from "../../utils/validators";
import { productsAtom } from "../products";
import { addNotificationAtom } from "../notifications";
import { selectedCouponAtom } from "../coupons";

// 장바구니 아이템들 (localStorage 연동)
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

// 장바구니 총 아이템 개수 (파생 상태)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// 장바구니에 상품 추가 액션
export const addToCartAtom = atom(
  null,
  (get, set, product: Product) => {
    const cart = get(cartAtom);
    
    // 장바구니 수량 + 1로 재고 검증
    const existingItem = cart.find((item) => item.product.id === product.id);
    const newQuantity = (existingItem?.quantity || 0) + 1;

    const validation = validateCartStock(product, newQuantity, cart);
    if (validation.errorMessage) {
      set(addNotificationAtom, validation.errorMessage, "error");
      return;
    }

    // 성공 알림
    set(addNotificationAtom, "장바구니에 담았습니다", "success");
    set(cartAtom, cartModel.addItemToCart(cart, product));
  }
);

// 장바구니에서 상품 제거 액션
export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    set(cartAtom, cartModel.removeItemFromCart(cart, productId));
  }
);

// 장바구니 수량 업데이트 액션
export const updateQuantityAtom = atom(
  null,
  (get, set, productId: string, newQuantity: number) => {
    const cart = get(cartAtom);
    const products = get(productsAtom);
    
    // 수량이 0 이하면 아이템 제거
    if (newQuantity <= 0) {
      set(cartAtom, cartModel.removeItemFromCart(cart, productId));
      return;
    }

    // 상품 찾기
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // 재고 검증
    const validation = validateCartStock(product, newQuantity, cart);
    if (validation.errorMessage) {
      set(addNotificationAtom, validation.errorMessage, "error");
      return;
    }
    
    // 수량 업데이트
    set(cartAtom, cartModel.updateCartItemQuantity(cart, productId, newQuantity));
  }
);

// ========== 파생 상태 아톰들 (계산된 값들) ==========

// 장바구니 총액 (파생 상태)
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return composedModels.calculateCartTotal(cart, selectedCoupon);
});

// 남은 재고 계산 함수 아톰
export const getRemainingStockAtom = atom((get) => {
  const cart = get(cartAtom);
  return (product: Product) => productModel.getRemainingStock(product, cart);
});

// 장바구니 아이템 총액 계산 함수 아톰  
export const calculateItemTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  return (item: CartItem) => composedModels.calculateItemTotal(item, cart);
});
