import { useReducer, useCallback } from "react";
import { CartItem } from "../../types";
import { ProductWithUI } from "../App";
import cartService from "../services/cart";
import orderService from "../services/order";
import useLocalStorage from "../utils/hooks/useLocalStorage";

type CartState = {
  cart: CartItem[];
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: ProductWithUI }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "RESET_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const result = cartService.addItemToCart({
        cart: state.cart,
        product: {
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          stock: action.payload.stock,
          discounts: action.payload.discounts,
        },
      });

      if (result.status === "success") {
        return { ...state, cart: result.value };
      }
      return state;
    }

    case "REMOVE_FROM_CART": {
      const result = cartService.removeItemFromCart({
        cart: state.cart,
        productId: action.payload,
      });

      if (result.status === "success") {
        return { ...state, cart: result.value };
      }
      return state;
    }

    case "UPDATE_QUANTITY": {
      const result = cartService.updateItemQuantity({
        cart: state.cart,
        productId: action.payload.productId,
        newQuantity: action.payload.quantity,
      });

      if (result.status === "success") {
        return { ...state, cart: result.value };
      }
      return state;
    }

    case "RESET_CART": {
      return { cart: [] };
    }

    default:
      return state;
  }
}

// 통합된 카트 훅
export function useCart() {
  const [storedCart, setStoredCart] = useLocalStorage<CartItem[]>("cart", []);

  const [state, dispatch] = useReducer(cartReducer, {
    cart: storedCart,
  });

  // localStorage 동기화
  const syncWithLocalStorage = useCallback(
    (newCart: CartItem[]) => {
      setStoredCart(newCart);
    },
    [setStoredCart]
  );

  // 액션 함수들
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = cartService.addItemToCart({
        cart: state.cart,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          discounts: product.discounts,
        },
      });

      if (result.status === "success") {
        dispatch({ type: "ADD_TO_CART", payload: product });
        syncWithLocalStorage(result.value);
      }

      return result;
    },
    [state.cart, syncWithLocalStorage]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const result = cartService.removeItemFromCart({
        cart: state.cart,
        productId,
      });

      if (result.status === "success") {
        dispatch({ type: "REMOVE_FROM_CART", payload: productId });
        syncWithLocalStorage(result.value);
      }

      return result;
    },
    [state.cart, syncWithLocalStorage]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const result = cartService.updateItemQuantity({
        cart: state.cart,
        productId,
        newQuantity: quantity,
      });

      if (result.status === "success") {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId, quantity },
        });
        syncWithLocalStorage(result.value);
      }

      return result;
    },
    [state.cart, syncWithLocalStorage]
  );

  const completeOrder = useCallback(() => {
    const result = orderService.completeOrder({
      cart: state.cart,
    });

    if (result.status === "success") {
      dispatch({ type: "RESET_CART" });
      syncWithLocalStorage([]);
    }

    return result;
  }, [state.cart, syncWithLocalStorage]);

  // 계산 함수들
  const calculateItemTotal = useCallback(
    (item: CartItem) => {
      return cartService.calculateItemTotal({ item, cart: state.cart });
    },
    [state.cart]
  );

  const calculateOriginalPrice = useCallback((item: CartItem) => {
    return cartService.calculateOriginalPrice(item);
  }, []);

  const calculateItemDiscountRate = useCallback(
    (originalPrice: number, calculatedTotal: number) => {
      return cartService.calculateItemDiscountRate(
        originalPrice,
        calculatedTotal
      );
    },
    []
  );

  const hasItemDiscount = useCallback(
    (originalPrice: number, calculatedTotal: number) => {
      return cartService.hasItemDiscount(originalPrice, calculatedTotal);
    },
    []
  );

  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    calculateItemTotal,
    calculateOriginalPrice,
    calculateItemDiscountRate,
    hasItemDiscount,
  };
}
