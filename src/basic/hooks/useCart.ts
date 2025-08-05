import { useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "../../types";

const initCart = () => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => initCart());

  const [totalItemCount, setTotalItemCount] = useState(0);

  // localStorage에 장바구니 저장
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // 총 아이템 개수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      const remaining = product.stock - (cartItem?.quantity || 0);
      return remaining;
    },
    [cart]
  );

  const getMaxApplicableDiscount = useCallback(
    (item: CartItem): number => {
      const { discounts } = item.product;
      const { quantity } = item;

      const baseDiscount = discounts.reduce((maxDiscount, discount) => {
        return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
      }, 0);

      const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
      if (hasBulkPurchase) {
        return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
      }

      return baseDiscount;
    },
    [cart]
  );

  const calculateItemTotal = useCallback(
    (item: CartItem): number => {
      const { price } = item.product;
      const { quantity } = item;
      const discount = getMaxApplicableDiscount(item);

      return Math.round(price * quantity * (1 - discount));
    },
    [getMaxApplicableDiscount]
  );

  const calculateCartTotal = useCallback((): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  }, [cart, calculateItemTotal]);

  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        throw new Error("재고가 부족합니다!");
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            throw new Error(`재고는 ${product.stock}개까지만 있습니다.`);
          }

          return prevCart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return [...prevCart, { product, quantity: 1 }];
      });
    },
    [getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: Product[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        throw new Error(`재고는 ${maxStock}개까지만 있습니다.`);
      }

      setCart((prevCart) =>
        prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem("cart");
    setCart([]);
  }, []);

  return {
    cart,
    totalItemCount,
    getRemainingStock,
    getMaxApplicableDiscount,
    calculateItemTotal,
    calculateCartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
