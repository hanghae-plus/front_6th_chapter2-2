// 장바구니 관련 액션 atom
import { atom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";
import { productsAtom } from "../atoms/productAtoms";
import { generateId } from "../index";
import { ProductWithUI } from "../../types";
import { selectedCouponAtom } from "../atoms/couponAtoms";
import { addNotificationHelper } from "./notificationActions";
import { Getter } from "jotai";
import { Setter } from "jotai";

export const handleAddToCartItem = atom(
  null,
  (get: Getter, set: Setter, product: ProductWithUI) => {
    try {
      const cart = get(cartAtom);
      const products = get(productsAtom);

      const existingItem = cart.find((item) => item.product.id === product.id);
      const productInStore = products.find((p) => p.id === product.id);

      if (!productInStore) {
        addNotificationHelper(get, set, "상품을 찾을 수 없습니다.", "error");
        return;
      }

      if (productInStore.stock <= 0) {
        addNotificationHelper(get, set, "재고가 부족합니다.", "error");
        return;
      }

      if (existingItem) {
        if (existingItem.quantity >= productInStore.stock) {
          addNotificationHelper(
            get,
            set,
            "재고보다 많은 수량을 담을 수 없습니다.",
            "error"
          );
          return;
        }

        const updatedCart = cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        set(cartAtom, updatedCart);
      } else {
        set(cartAtom, [...cart, { product, quantity: 1 }]);
      }

      addNotificationHelper(get, set, "장바구니에 담았습니다", "success");
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "장바구니 추가 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);

export const handleRemoveCartItem = atom(
  null,
  (get: Getter, set: Setter, productId: string) => {
    try {
      const cart = get(cartAtom);
      const updatedCart = cart.filter((item) => item.product.id !== productId);
      set(cartAtom, updatedCart);
      addNotificationHelper(
        get,
        set,
        "장바구니에서 제거되었습니다.",
        "success"
      );
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "장바구니 제거 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);

export const handleUpdateQuantityItem = atom(
  null,
  (get, set, productId: string, newQuantity: number) => {
    try {
      const cart = get(cartAtom);
      const products = get(productsAtom);

      const product = products.find((p) => p.id === productId);
      if (!product) {
        addNotificationHelper(get, set, "상품을 찾을 수 없습니다.", "error");
        return;
      }

      if (newQuantity <= 0) {
        const updatedCart = cart.filter(
          (item) => item.product.id !== productId
        );
        set(cartAtom, updatedCart);
        addNotificationHelper(
          get,
          set,
          "장바구니에서 제거되었습니다.",
          "success"
        );
        return;
      }

      if (newQuantity > product.stock) {
        addNotificationHelper(
          get,
          set,
          `재고는 ${product.stock}개까지만 있습니다.`,
          "error"
        );
        return;
      }

      const updatedCart = cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      set(cartAtom, updatedCart);
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "수량 변경 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);

export const handleClearCartItem = atom(null, (get: Getter, set: Setter) => {
  set(cartAtom, []);
  addNotificationHelper(get, set, "장바구니가 비워졌습니다.", "success");
});

export const handleCompleteOrderItem = atom(
  null,
  (get: Getter, set: Setter) => {
    try {
      const orderNumber = generateId("ORD");
      addNotificationHelper(
        get,
        set,
        `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
        "success"
      );
      set(cartAtom, []);
      set(selectedCouponAtom, null);
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "주문 처리 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);
