import { useState } from 'react';
import { TabLayout } from './ui/layout/TabLayout';
import ProductTab from './ui/product/ProductTab';
import CouponTab from './ui/coupon/CouponTab';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';

const AdminPage = () => {
  // 관리자 페이지 - 활성화된 탭 (상품/쿠폰 관리)
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const { getRemainingStock } = useCart();
  const { addNotification } = useNotification();

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
          deleteCoupon={removeCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminPage;
