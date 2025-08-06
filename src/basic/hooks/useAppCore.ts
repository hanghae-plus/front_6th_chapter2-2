import { useNotifications } from "./useNotifications";
import { useCartHandlers } from "../entities/cart";
import {
  useProductHandlers,
  useProductUtils,
  useSearchProduct,
  productModel,
} from "../entities/products";
import { useAppState } from "./useAppState";

/**
 * 애플리케이션 핵심 상태와 로직을 관리하는 훅
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

  // 도메인별 핸들러들
  const { products, addProduct, updateProduct, deleteProduct, findProduct } =
    useProductHandlers({ addNotification });

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    findCartItem,
    totalItemCount,
    isEmpty: isCartEmpty,
  } = useCartHandlers({ addNotification });

  // 검색 관리
  const searchHook = useSearchProduct();

  // 상품 유틸리티 함수들
  const productUtils = useProductUtils({ products, cart });

  // 검색된 상품 목록 - productModel의 searchProducts 사용
  const filteredProducts = productModel.searchProducts(
    products,
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

    // 도메인 상태
    products,
    cart,
    totalItemCount,
    isCartEmpty,

    // 도메인 핸들러들
    addProduct,
    updateProduct,
    deleteProduct,
    findProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    findCartItem,

    // 검색 관련
    ...searchHook,
    filteredProducts,

    // 상품 유틸리티
    ...productUtils,
  };
};
