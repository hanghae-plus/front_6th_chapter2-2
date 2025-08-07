import { useState } from 'react';
import { Coupon, Product } from '../../types';
import { TabLayout } from './ui/layout/TabLayout';
import ProductTab from './ui/product/ProductTab';
import CouponTab from './ui/coupon/CouponTab';

interface AdminPageProps {
  // products
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  getRemainingStock: (product: Product) => number;

  // coupons
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;

  // notification
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

const AdminPage = ({
  products,
  getRemainingStock,
  coupons,
  addNotification,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon,
  selectedCoupon,
  setSelectedCoupon,
}: AdminPageProps) => {
  // 관리자 페이지 - 활성화된 탭 (상품/쿠폰 관리)
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const handleActiveTab = (value: 'products' | 'coupons') => {
    setActiveTab(value);
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        {/* 탭 활성화 네비게이션 */}
        <TabLayout activeTab={activeTab} handleActiveTab={handleActiveTab} />
      </div>

      {activeTab === 'products' ? (
        // Product Tab
        <ProductTab
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          getRemainingStock={getRemainingStock}
          addNotification={addNotification}
        />
      ) : (
        // Coupon Tab
        <CouponTab
          coupons={coupons}
          addCoupon={addCoupon}
          deleteCoupon={deleteCoupon}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminPage;
