import { useActiveTab } from '../../shared/hooks';
import { Coupon, ProductWithUI } from '../../types';
import { Tab } from '../../shared/components';
import { ProductList } from '../components/product';
import { CouponList } from '../components/coupon';

interface AdminPageProps {
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteCoupon: (code: string) => void;
  coupons: Coupon[];
  products: ProductWithUI[];
  remainingStock: (product: ProductWithUI) => number;
  onAddNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export function AdminPage({
  addProduct,
  updateProduct,
  addCoupon,
  onDeleteProduct,
  onDeleteCoupon,
  products,
  remainingStock,
  onAddNotification,
  coupons,
}: AdminPageProps) {
  const { activeTab, handleSwitchTab } = useActiveTab();

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader />

      <Tab activeTab={activeTab} onSwitchTab={handleSwitchTab} />

      {activeTab === 'products' ? (
        <ProductList
          products={products}
          remainingStock={remainingStock}
          addProduct={addProduct}
          updateProduct={updateProduct}
          onDeleteProduct={onDeleteProduct}
          onAddNotification={onAddNotification}
          isAdmin={true}
        />
      ) : (
        <CouponList
          coupons={coupons}
          addCoupon={addCoupon}
          onDeleteCoupon={onDeleteCoupon}
          onAddNotification={onAddNotification}
        />
      )}
    </div>
  );
}

function AdminHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
      <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
    </div>
  );
}
