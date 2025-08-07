import { useCallback, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";
import { CartItem } from "../../types";
import { ProductWithUI } from "../types/product";
import { useNotification } from "./useNotification";
import { calculateRemainingStock, calculateItemTotal } from "../utils/cartCalculations";
import { loadDataFromStorage, removeDataFromStorage, saveDataToStorage } from "../utils/localStorageUtils";
import { addItemToCart, removeItemFromCart, updateItemQuantity, validateStockAvailability, validateQuantity } from "../utils/cartUtils";

interface UseCartProps {
  products: ProductWithUI[];
}

export const useCart = ({ products }: UseCartProps) => {
  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 장바구니 상태 - Jotai 사용 */
  const [cart, setCart] = useAtom(cartAtom);

  /** 초기 데이터 로드 */
  useEffect(() => {
    const savedCart = loadDataFromStorage<CartItem[]>("cart", []);
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, [setCart]);

  /** 재고 계산 */
  const getRemainingStock = useMemo(
    () =>
      (product: ProductWithUI): number => {
        return calculateRemainingStock(product, cart);
      },
    [cart]
  );

  /** 개별 상품 총액 계산 */
  const calculateItemTotalForCart = useCallback(
    (item: CartItem): number => {
      return calculateItemTotal(item, cart);
    },
    [cart]
  );

  /** 장바구니 추가 */
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      if (!validateStockAvailability(product, cart)) {
        showToast("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const newCart = addItemToCart(prevCart, product);

        // 재고 초과 시 에러 메시지
        if (newCart === prevCart) {
          showToast(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        }

        return newCart;
      });

      showToast("장바구니에 담았습니다", "success");
    },
    [cart, showToast, setCart]
  );

  /** 장바구니 삭제 */
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => removeItemFromCart(prevCart, productId));
    },
    [setCart]
  );

  /** 장바구니 수량 변경 */
  const updateCartQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      // 상품 존재 여부 검증
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // 수량 유효성 검증
      if (!validateQuantity(newQuantity, product.stock)) {
        showToast(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) => updateItemQuantity(prevCart, productId, newQuantity, product.stock));
    },
    [products, showToast, setCart]
  );

  // localStorage 동기화
  useEffect(() => {
    if (cart.length > 0) {
      saveDataToStorage("cart", cart);
    } else {
      removeDataFromStorage("cart");
    }
  }, [cart]);

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getRemainingStock,
    calculateItemTotal: calculateItemTotalForCart,
  };
};
