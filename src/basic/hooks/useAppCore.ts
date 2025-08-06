import { useNotifications } from "./useNotifications";
import { useCartHandlers } from "../entities/cart/useCartHandlers";
import { useProductHandlers } from "../entities/products/useProductHandlers";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useProductForm } from "../entities/products/useProductForm";
import { useAdminHandlers } from "./useAdminHandlers";
import { useOrderHandlers } from "./useOrderHandlers";
import { useAppUtils } from "./useAppUtils";
import { useAppState } from "./useAppState";
import { useSearchProduct } from "./useSearchProduct";
import { calculateCartTotal } from "../utils/calculateCartTotal";

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

  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  } = useCouponHandlers({ addNotification });

  // 폼 관리
  const productFormHook = useProductForm();

  // 검색 관리
  const searchHook = useSearchProduct();

  // 관리자 페이지 핸들러들
  const adminHandlers = useAdminHandlers({
    addProduct,
    updateProduct,
    addCoupon,
    productForm: productFormHook.productForm,
    setProductForm: productFormHook.setProductForm,
    editingProduct: productFormHook.editingProduct,
    setEditingProduct: productFormHook.setEditingProduct,
    setShowProductForm: productFormHook.setShowProductForm,
  });

  // 주문 핸들러들
  const orderHandlers = useOrderHandlers({
    addNotification,
    setCart,
    setSelectedCoupon,
  });

  // 유틸리티 함수들
  const utils = useAppUtils({ products, cart });

  // 계산된 값들
  const totals = calculateCartTotal(cart, selectedCoupon);
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
    totalItemCount,
    coupons,
    selectedCoupon,
    setSelectedCoupon,

    // 도메인 핸들러들
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    addCoupon,
    deleteCoupon,
    applyCoupon,

    // 폼 관련
    ...productFormHook,

    // 검색 관련
    ...searchHook,
    filteredProducts,

    // 관리자 핸들러들
    ...adminHandlers,

    // 주문 핸들러들
    ...orderHandlers,

    // 유틸리티
    ...utils,

    // 계산된 값들
    totals,
  };
};
