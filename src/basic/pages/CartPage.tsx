import { useCallback } from 'react';

import type { CartItem, ProductWithUI } from '../../types';
import { useCoupons } from '../hooks/useCoupons';
import { useProducts } from '../hooks/useProducts';
import PaymentSection from '../layouts/PaymentSection';
import ProductList from '../layouts/ProductList';

// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시
// - Cart: 장바구니 표시 및 결제

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

type TCartPageProps = {
  cart: CartItem[];
  debouncedSearchTerm: string;

  addToCart: (product: ProductWithUI) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getRemainingStock: (product: ProductWithUI) => number;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export function CartPage(props: TCartPageProps) {
  const {
    cart,
    debouncedSearchTerm,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getRemainingStock,
    setNotifications,
  } = props;

  const { coupons } = useCoupons();

  const { products } = useProducts();

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 */}
        <ProductList
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
          addToCart={addToCart}
          addNotification={addNotification}
          getRemainingStock={getRemainingStock}
        />
      </div>

      <div className='lg:col-span-1'>
        <PaymentSection
          products={products}
          cart={cart}
          coupons={coupons}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          addNotification={addNotification}
        />
      </div>
    </div>
  );
}
