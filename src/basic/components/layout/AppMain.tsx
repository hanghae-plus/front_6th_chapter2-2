// components/layout/AppMain.tsx
import AdminView from '../view/AdminView.tsx';
import ShoppingView from '../view/ShoppingView.tsx';
import { ProductWithUI, CartItem, Coupon } from '../../models/entities';

// 관심사별 interface 분리
interface ProductActions {
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

interface CartActions {
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  onResetCart: () => void;
}

interface CouponActions {
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  resetCoupon: () => void;
}

interface SearchState {
  debouncedSearchTerm: string;
}

interface CommonActions {
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}

interface AppMainProps {
  // 앱 상태
  isAdmin: boolean;

  // 데이터 상태들
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;

  // 관심사별 액션들
  productActions: ProductActions;
  cartActions: CartActions;
  couponActions: CouponActions;
  searchState: SearchState;
  commonActions: CommonActions;
}

const AppMain = ({
  isAdmin,
  products,
  cart,
  coupons,
  selectedCoupon,
  productActions,
  cartActions,
  couponActions,
  searchState,
  commonActions,
}: AppMainProps) => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {isAdmin ? (
        <AdminView
          cart={cart}
          products={products}
          coupons={coupons}
          addNotification={commonActions.addNotification}
          updateProduct={productActions.updateProduct}
          deleteProduct={productActions.deleteProduct}
          addProduct={productActions.addProduct}
          deleteCoupon={couponActions.deleteCoupon}
          addCoupon={couponActions.addCoupon}
        />
      ) : (
        <ShoppingView
          products={products}
          addNotification={commonActions.addNotification}
          debouncedSearchTerm={searchState.debouncedSearchTerm}
          cart={cart}
          coupons={coupons}
          addToCart={cartActions.addToCart}
          onRemoveFromCart={cartActions.removeFromCart}
          onUpdateQuantity={cartActions.updateQuantity}
          onApplyCoupon={couponActions.applyCoupon}
          onResetCart={cartActions.onResetCart}
          selectedCoupon={selectedCoupon}
          onResetCoupon={couponActions.resetCoupon}
        />
      )}
    </main>
  );
};

export default AppMain;
