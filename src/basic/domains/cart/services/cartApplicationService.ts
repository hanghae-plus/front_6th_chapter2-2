import type { CartItem, Product } from "../../../../types";
import type { NotificationFunction } from "../../../shared";
import { cartNotificationService, cartValidationService, orderService } from "./index";

type CartUpdater = (updater: (prevCart: CartItem[]) => CartItem[]) => void;

export const cartApplicationService = {
  addToCart: (
    product: Product,
    cart: CartItem[],
    updateCart: CartUpdater,
    addNotification: NotificationFunction
  ) => {
    const validation = cartValidationService.validateAddToCart(product, cart);
    if (!validation.valid) {
      cartNotificationService.showValidationError(validation.message!, addNotification);
      return;
    }

    updateCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const quantityValidation = cartValidationService.validateQuantityIncrease(
          product,
          existingItem.quantity
        );
        if (!quantityValidation.valid) {
          cartNotificationService.showValidationError(quantityValidation.message!, addNotification);
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });

    cartNotificationService.showAddToCartSuccess(addNotification);
  },

  removeFromCart: (productId: string, updateCart: CartUpdater) => {
    updateCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  },

  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: Product[],
    updateCart: CartUpdater,
    addNotification: NotificationFunction
  ) => {
    const validation = cartValidationService.validateQuantityUpdate(
      productId,
      newQuantity,
      products
    );
    if (!validation.valid) {
      cartNotificationService.showValidationError(validation.message!, addNotification);
      return;
    }

    if (newQuantity <= 0) {
      cartApplicationService.removeFromCart(productId, updateCart);
      return;
    }

    updateCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  },

  completeOrder: (
    clearCart: () => void,
    clearSelectedCoupon: () => void,
    addNotification: NotificationFunction
  ) => {
    const orderNumber = orderService.processOrder(clearCart, clearSelectedCoupon);
    cartNotificationService.showOrderSuccess(orderNumber, addNotification);
  }
};
