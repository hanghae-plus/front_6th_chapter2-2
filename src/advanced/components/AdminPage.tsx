import { useState } from 'react';

import { initialProductForm } from '../constants';
import { CouponForm } from './admin-page/CouponForm';
import { CouponList } from './admin-page/CouponList';
import { ProductForm } from './admin-page/ProductForm';
import { ProductTable } from './admin-page/ProductTable';
import { useCoupons } from '../hooks/useCoupons';
import { useProducts } from '../hooks/useProducts';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const {
    showProductForm,
    startAddProduct,
    startEditProduct,
    productForm,
    editingProduct,
    setShowProductForm,
    setEditingProduct,
    handleProductSubmit,
    setProductForm,
  } = useProducts();

  const { couponForm, setCouponForm, handleCouponSubmit, showCouponForm, setShowCouponForm } =
    useCoupons();

  const handleClickCancel = () => {
    setEditingProduct(null);
    setShowProductForm(false);
    setProductForm(initialProductForm);
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <section className='bg-white rounded-lg border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>상품 목록</h2>
              <button
                onClick={() => startAddProduct()}
                className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <ProductTable onEdit={startEditProduct} />

          {showProductForm && (
            <ProductForm
              productForm={productForm}
              setProductForm={setProductForm}
              editingProduct={editingProduct}
              onSubmit={handleProductSubmit}
              onCancel={handleClickCancel}
            />
          )}
        </section>
      ) : (
        <section className='bg-white rounded-lg border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
          </div>
          <div className='p-6'>
            <CouponList setShowCouponForm={setShowCouponForm} />

            {showCouponForm && (
              <CouponForm
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                onSubmit={handleCouponSubmit}
                setShowCouponForm={setShowCouponForm}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
