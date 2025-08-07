import { useState } from 'react';
import ProductManagement from './ProductManagement';
import Tab from '../ui/Tab';
import CouponsManagement from './CouponsManagement';
import { CartItem, Coupon, CouponForm, Product, ProductFormType } from '../../../types';

interface AdminDashboardProps {
  products: Product[];
  isAdmin: boolean;
  cart: CartItem[];
  editingProduct: string | null;
  productForm: ProductFormType;
  coupons: Coupon[];
  couponForm: CouponForm;
  onEditClick: (value: string | null) => void;
  onFormChange: (form: ProductFormType) => void;
  handleProductEdit: (product: Product) => void;
  onProductDelete: (id: string) => void;
  handleProductSubmit: (e: React.FormEvent, callback: () => void) => void;
  onCouponDelete: (code: string) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onCouponFormChange: (form: CouponForm) => void;
  onNotify: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export default function AdminDashboard({
  products,
  isAdmin,
  cart,
  editingProduct,
  productForm,
  coupons,
  couponForm,
  onEditClick,
  onFormChange,
  handleProductEdit,
  onProductDelete,
  handleProductSubmit,
  onCouponDelete,
  onCouponSubmit,
  onCouponFormChange,
  onNotify,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <Tab isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            상품 관리
          </Tab>
          <Tab isActive={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')}>
            쿠폰 관리
          </Tab>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          isAdmin={isAdmin}
          cart={cart}
          editingProduct={editingProduct}
          productForm={productForm}
          handleProductEdit={handleProductEdit}
          handleProductSubmit={handleProductSubmit}
          onEditClick={onEditClick}
          onFormChange={onFormChange}
          onProductDelete={onProductDelete}
          onNotify={onNotify}
        />
      ) : (
        <CouponsManagement
          coupons={coupons}
          couponForm={couponForm}
          onCouponDelete={onCouponDelete}
          onCouponSubmit={onCouponSubmit}
          onCouponFormChange={onCouponFormChange}
          onNotify={onNotify}
        />
      )}
    </div>
  );
}
