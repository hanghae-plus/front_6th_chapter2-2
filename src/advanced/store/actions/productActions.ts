// 상품 관련 액션 atom
import { atom } from "jotai";
import { generateId } from "../index";
import { productsAtom } from "../atoms/productAtoms";
import { ProductWithUI } from "../../types";
import { cartAtom } from "../atoms/cartAtoms";
import { addNotificationHelper } from "./notificationActions";
import { Getter } from "jotai";
import { Setter } from "jotai";

export const addProductAtom = atom(
  null,
  (get: Getter, set: Setter, newProduct: Omit<ProductWithUI, "id">) => {
    try {
      const products = get(productsAtom);
      const newProductWithId = {
        ...newProduct,
        id: generateId("product"),
      };
      set(productsAtom, [...products, newProductWithId]);
      addNotificationHelper(get, set, "상품이 추가되었습니다.", "success");
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "상품 추가 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);

export const updateProductAtom = atom(
  null,
  (
    get: Getter,
    set: Setter,
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    try {
      const products = get(productsAtom);
      const updatedProducts = products.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      );
      set(productsAtom, updatedProducts);
      addNotificationHelper(get, set, "상품이 수정되었습니다.", "success");
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "상품 수정 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);

export const removeProductAtom = atom(
  null,
  (get: Getter, set: Setter, productId: string) => {
    try {
      const products = get(productsAtom);
      const cart = get(cartAtom);

      // 장바구니에서도 해당 상품 제거
      const updatedCart = cart.filter((item) => item.product.id !== productId);
      set(cartAtom, updatedCart);

      // 상품 목록에서 제거
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      set(productsAtom, updatedProducts);

      addNotificationHelper(get, set, "상품이 삭제되었습니다.", "success");
    } catch (error) {
      addNotificationHelper(
        get,
        set,
        "상품 삭제 중 오류가 발생했습니다.",
        "error"
      );
    }
  }
);
