import { useCallback } from "react";
import { ProductWithUI, calculateRemainingStock } from "@entities/product";
import { useCart } from "@entities/cart";
import { useGlobalNotification } from "@entities/notification";

interface UseManageCartOptions {
  products: ProductWithUI[];
}

export function useManageCart({ products }: UseManageCartOptions) {
  const cart = useCart();
  const { showErrorNotification, showSuccessNotification } =
    useGlobalNotification();

  const getProductRemainingStock = useCallback(
    (product: ProductWithUI): number => {
      const cartItem = cart.cart.find((item) => item.id === product.id);
      const cartQuantity = cartItem?.quantity || 0;
      return calculateRemainingStock(product.stock, cartQuantity);
    },
    [cart.cart]
  );

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getProductRemainingStock(product);

      if (remainingStock <= 0) {
        showErrorNotification("재고가 부족합니다!");
        return;
      }

      const existingItem = cart.cart.find((item) => item.id === product.id);
      const currentQuantity = existingItem?.quantity || 0;

      if (currentQuantity + 1 > product.stock) {
        showErrorNotification(`재고는 ${product.stock}개까지만 있습니다.`);
        return;
      }

      cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        discounts: product.discounts || [],
        quantity: 1,
      });
      showSuccessNotification("장바구니에 담았습니다");
    },
    [cart, showSuccessNotification, getProductRemainingStock]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        cart.removeItem(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (newQuantity > product.stock) {
        showErrorNotification(`재고는 ${product.stock}개까지만 있습니다.`);
        return;
      }

      cart.updateItemQuantity(productId, newQuantity);
    },
    [cart, products, showErrorNotification]
  );

  return {
    cart: cart.cart,
    cartItemCount: cart.cartItemCount,

    addToCart,
    removeItem: cart.removeItem,
    updateQuantity,
    clearCart: cart.clearCart,

    getItemTotal: cart.getItemTotal,
    getProductRemainingStock,
  };
}
