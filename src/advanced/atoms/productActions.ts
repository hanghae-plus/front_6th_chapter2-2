import { atom } from "jotai";
import {
  ProductWithUI,
  createProduct,
  createEmptyProductForm,
  createProductFormFromProduct,
  generateProductId,
} from "../models/product";
import { addDiscountToList, removeDiscountFromList } from "../models/discount";
import { productsAtom, productFormAtom, editingProductAtom } from "./appAtoms";
import { addSuccessNotificationActionAtom } from "./notificationActions";
import { SUCCESS_MESSAGES } from "../constants/messages";

/**
 * 새 상품 추가 액션
 */
export const addProductActionAtom = atom(
  null,
  (get, set, { newProduct }: { newProduct: Omit<ProductWithUI, "id"> }) => {
    const prevProducts = get(productsAtom);
    const product = createProduct(newProduct, generateProductId(Date.now()));
    set(productsAtom, [...prevProducts, product]);
    set(addSuccessNotificationActionAtom, SUCCESS_MESSAGES.PRODUCT_ADDED);
  }
);

/**
 * 상품 업데이트 액션
 */
export const updateProductActionAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      updates,
    }: {
      productId: string;
      updates: Partial<ProductWithUI>;
    }
  ) => {
    const prevProducts = get(productsAtom);
    const updatedProducts = prevProducts.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    set(productsAtom, updatedProducts);
    set(addSuccessNotificationActionAtom, SUCCESS_MESSAGES.PRODUCT_UPDATED);
  }
);

/**
 * 상품 삭제 액션
 */
export const deleteProductActionAtom = atom(
  null,
  (get, set, productId: string) => {
    const prevProducts = get(productsAtom);
    const filteredProducts = prevProducts.filter(
      (product) => product.id !== productId
    );
    set(productsAtom, filteredProducts);
    set(addSuccessNotificationActionAtom, SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
);

/**
 * 상품 편집 시작 액션
 */
export const startEditProductActionAtom = atom(
  null,
  (_, set, product: ProductWithUI | null) => {
    if (product) {
      set(productFormAtom, createProductFormFromProduct(product));
      set(editingProductAtom, product.id);
    } else {
      set(productFormAtom, createEmptyProductForm());
      set(editingProductAtom, "new");
    }
  }
);

/**
 * 할인 추가 액션
 */
export const addDiscountActionAtom = atom(null, (get, set) => {
  const prevProductForm = get(productFormAtom);
  const updatedDiscounts = addDiscountToList(prevProductForm.discounts);
  set(productFormAtom, { ...prevProductForm, discounts: updatedDiscounts });
});

/**
 * 할인 제거 액션
 */
export const removeDiscountActionAtom = atom(
  null,
  (get, set, index: number) => {
    const prevProductForm = get(productFormAtom);
    const updatedDiscounts = removeDiscountFromList(
      prevProductForm.discounts,
      index
    );
    set(productFormAtom, { ...prevProductForm, discounts: updatedDiscounts });
  }
);

/**
 * 할인 수량 변경 액션
 */
export const updateDiscountQuantityActionAtom = atom(
  null,
  (get, set, { index, quantity }: { index: number; quantity: number }) => {
    const prevProductForm = get(productFormAtom);
    const updatedDiscounts = prevProductForm.discounts.map((discount, i) =>
      i === index ? { ...discount, quantity } : discount
    );
    set(productFormAtom, { ...prevProductForm, discounts: updatedDiscounts });
  }
);

/**
 * 할인율 변경 액션
 */
export const updateDiscountRateActionAtom = atom(
  null,
  (get, set, { index, rate }: { index: number; rate: number }) => {
    const productForm = get(productFormAtom);
    const updatedDiscounts = productForm.discounts.map((discount, i) =>
      i === index ? { ...discount, rate } : discount
    );
    set(productFormAtom, { ...productForm, discounts: updatedDiscounts });
  }
);
