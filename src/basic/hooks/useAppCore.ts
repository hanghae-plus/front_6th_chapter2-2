import { useNotifications } from "./useNotifications";
import { useCartHandlers } from "../entities/cart";
import {
  useProductHandlers,
  useProductUtils,
  useSearchProduct,
} from "../entities/products";
import { useAppState } from "./useAppState";

export const useAppCore = () => {
  // 기본 상태들
  const { notifications, setNotifications, addNotification } =
    useNotifications();
  const { isAdmin, setIsAdmin } = useAppState();

  // 도메인별 핸들러들
  const { products, setProducts, addProduct, updateProduct, deleteProduct } =
    useProductHandlers({ addNotification });

  const {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItemCount,
  } = useCartHandlers({ addNotification });

  // 검색 관리
  const searchHook = useSearchProduct();

  // 상품 유틸리티 함수들
  const productUtils = useProductUtils({ products, cart });

  // 계산된 값들
  const filteredProducts = searchHook.debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(searchHook.debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchHook.debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return {
    // 기본 상태
    notifications,
    setNotifications,
    addNotification,
    isAdmin,
    setIsAdmin,

    // 도메인 상태
    products,
    setProducts,
    cart,
    setCart,
    totalItemCount,

    // 도메인 핸들러들
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,

    // 검색 관련
    ...searchHook,
    filteredProducts,

    // 상품 유틸리티
    ...productUtils,
  };
};
