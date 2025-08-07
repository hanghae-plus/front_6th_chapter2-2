import { useState } from 'react';

import {
  ProductWithUI,
  CartItem,
  Coupon,
  ProductForm as ProductFormType,
  CouponForm as CouponFormType,
} from '../../types';
import AdminTabs from '../components/admin/AdminTabs';
import CouponManagement from '../components/admin/CouponManagement';
import ProductManagement from '../components/admin/ProductManagement';

interface AdminPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addProduct: (
    product: ProductFormType,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  updateProduct: (
    id: string,
    product: ProductFormType,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  deleteProduct: (
    id: string,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  addCoupon: (
    coupon: CouponFormType,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  removeCoupon: (
    code: string,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  addNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const AdminPage = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  removeCoupon,
  addNotification,
}: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          cart={cart}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          addCoupon={addCoupon}
          removeCoupon={removeCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminPage;
