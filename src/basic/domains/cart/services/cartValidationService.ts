import type { CartItem, Product } from "../../../../types";
import type { ValidationResult } from "../../../shared";
import { getRemainingStock } from "../utils";

const createValidationResult = (valid: boolean, message?: string): ValidationResult => ({
  valid,
  message
});

const validateStockAvailability = (requiredQuantity: number, availableStock: number) => {
  return requiredQuantity > availableStock
    ? createValidationResult(false, `재고는 ${availableStock}개까지만 있습니다.`)
    : createValidationResult(true);
};

const findProductById = (productId: string, products: Product[]) => {
  const product = products.find((p) => p.id === productId);
  return product
    ? { product, error: null }
    : { product: null, error: createValidationResult(false, "상품을 찾을 수 없습니다.") };
};

export const cartValidationService = {
  validateAddToCart: (product: Product, cart: CartItem[]) => {
    const remainingStock = getRemainingStock(product, cart);
    return remainingStock <= 0
      ? createValidationResult(false, "재고가 부족합니다!")
      : createValidationResult(true);
  },

  validateQuantityIncrease: (product: Product, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    return validateStockAvailability(newQuantity, product.stock);
  },

  validateQuantityUpdate: (productId: string, newQuantity: number, products: Product[]) => {
    if (newQuantity <= 0) {
      return createValidationResult(true);
    }

    const { product, error } = findProductById(productId, products);
    if (error) {
      return error;
    }

    return validateStockAvailability(newQuantity, product!.stock);
  }
};
