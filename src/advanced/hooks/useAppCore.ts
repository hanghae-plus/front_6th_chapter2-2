import { useNotifications } from "./useNotifications";
import { useCartHandlers } from "../entities/cart";
import {
  useProductHandlers,
  useProductUtils,
  useSearchProduct,
  productModel,
} from "../entities/products";
import { useAppState } from "./useAppState";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";

/**
 * 애플리케이션 핵심 상태와 로직을 관리하는 훅 (네임스페이스 구조)
 */
export const useAppCore = () => {
  // 기본 상태들
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();
  const { isAdmin, toggleAdminMode } = useAppState();

  // 도메인별 핸들러들 (네임스페이스 구조 활용)
  const productHandlers = useProductHandlers({ addNotification });
  const cartHandlers = useCartHandlers({ addNotification });
  const couponHandlers = useCouponHandlers({ addNotification });

  // 검색 관리
  const searchHook = useSearchProduct();

  // 상품 유틸리티 함수들
  const productUtils = useProductUtils({
    products: productHandlers.state.items,
    cart: cartHandlers.state.items,
  });

  // 검색된 상품 목록 - productModel의 searchProducts 사용
  const filteredProducts = productModel.searchProducts(
    productHandlers.state.items,
    searchHook.debouncedSearchTerm
  );

  return {
    // 기본 상태
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    isAdmin,
    toggleAdminMode,

    // 도메인별 네임스페이스 (핸들러의 네임스페이스 구조 활용)
    product: {
      ...productHandlers.state,
      ...productHandlers.actions,
      utils: productUtils,
      search: searchHook,
      filteredItems: filteredProducts,
    },

    cart: {
      ...cartHandlers.state,
      ...cartHandlers.actions,
    },

    coupon: {
      ...couponHandlers.state,
      ...couponHandlers.actions,
    },

    // 하위 호환성을 위해 기존 방식도 유지 (점진적 마이그레이션용)
    // TODO: 모든 컴포넌트가 네임스페이스 방식으로 변경되면 제거 예정
    products: productHandlers.products,
    addProduct: productHandlers.addProduct,
    updateProduct: productHandlers.updateProduct,
    deleteProduct: productHandlers.deleteProduct,
    addToCart: cartHandlers.addToCart,
    removeFromCart: cartHandlers.removeFromCart,
    updateQuantity: cartHandlers.updateQuantity,
    clearCart: cartHandlers.clearCart,
    searchTerm: searchHook.searchTerm,
    handleSearch: searchHook.handleSearch,
    debouncedSearchTerm: searchHook.debouncedSearchTerm,
    filteredProducts,
    checkSoldOutByProductId: productUtils.checkSoldOutByProductId,
  };
};
