import { useState } from 'react';

import type { Coupon, NotificationVariant } from '../../types';
import type { ProductWithUI } from '../constants';
import { useCouponForm } from '../hooks/useCouponForm';
import { useProductForm } from '../hooks/useProductForm';
import { AdminHeader } from './ui/AdminHeader';
import { CouponAddButton } from './ui/CouponAddButton';
import { CouponForm } from './ui/CouponForm';
import { CouponList } from './ui/CouponList';
import { ProductAccordion } from './ui/ProductAccordion';
import { ProductForm } from './ui/ProductForm';
import { TabNavigation } from './ui/TabNavigation';

interface AdminPageProps {
  setIsAdmin: (isAdmin: boolean) => void;

  products: ProductWithUI[];
  onAddProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;

  coupons: Coupon[];
  onAddCoupon: (newCoupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;

  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function AdminPage({
  setIsAdmin,

  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,

  coupons,
  onAddCoupon,
  onDeleteCoupon,

  onAddNotification,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const {
    showProductForm,
    editingProduct,
    productFormData,
    updateProductFormData,
    startEditProduct,
    handleProductSubmit,
    handleShowProductForm,
    handleCancelProductForm,
  } = useProductForm({
    onAddProduct,
    onUpdateProduct,
  });

  const {
    showCouponForm,
    couponFormData,
    updateCouponFormData,
    handleCouponSubmit,
    handleShowCouponForm,
    handleHideCouponForm,
  } = useCouponForm({
    onAddCoupon,
  });

  return (
    <>
      <AdminHeader onBackShop={() => setIsAdmin(false)} />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
            <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'products' ? (
            <section className='bg-white rounded-lg border border-gray-200'>
              <div className='p-6 border-b border-gray-200'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-semibold'>상품 목록</h2>
                  <button
                    onClick={handleShowProductForm}
                    className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
                  >
                    새 상품 추가
                  </button>
                </div>
              </div>

              <ProductAccordion
                products={products}
                onEdit={startEditProduct}
                onDelete={onDeleteProduct}
              />

              <ProductForm
                isOpen={showProductForm}
                editingProduct={editingProduct}
                form={productFormData}
                updateForm={updateProductFormData}
                onSubmit={handleProductSubmit}
                onCancel={handleCancelProductForm}
                onAddNotification={onAddNotification}
              />
            </section>
          ) : (
            <section className='bg-white rounded-lg border border-gray-200'>
              <div className='p-6 border-b border-gray-200'>
                <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <CouponList coupons={coupons} onDelete={onDeleteCoupon} />

                  <CouponAddButton onAddNew={handleShowCouponForm} />
                </div>

                <CouponForm
                  isOpen={showCouponForm}
                  form={couponFormData}
                  updateForm={updateCouponFormData}
                  onSubmit={handleCouponSubmit}
                  onCancel={handleHideCouponForm}
                  onAddNotification={onAddNotification}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
