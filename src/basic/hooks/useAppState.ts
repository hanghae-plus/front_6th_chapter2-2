import { useState } from "react";
import { useProducts } from "./useProducts";
import { useCart } from "./useCart";
import { useCoupons } from "./useCoupons";
import { useOrder } from "./useOrder";
import { useSearch } from "../utils/hooks/useSearch";

export const useAppState = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  // 각 도메인별 상태 관리
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(addNotification);
  const { cart, totalItemCount, addToCart, removeFromCart, updateQuantity, clearCart } = useCart(addNotification);
  const { coupons, selectedCoupon, addCoupon, deleteCoupon, applyCoupon, setSelectedCoupon } =
    useCoupons(addNotification);

  // 검색 기능
  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

  // 주문 기능
  const { completeOrder } = useOrder({ clearCart, setSelectedCoupon, addNotification });

  // UI 상태
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => setIsAdmin(!isAdmin);

  return {
    // 도메인별 상태
    products,
    cart,
    coupons,
    selectedCoupon,

    // 도메인별 액션
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,

    // 검색 관련
    searchTerm,
    setSearchTerm,
    filteredProducts,
    searchInfo,

    // UI 상태
    isAdmin,
    toggleAdmin,
    totalItemCount,
  };
};
