import { useState } from 'react';

import { Product } from '../../types';
import { CouponForm } from './admin-page/CouponForm';
import { CouponList } from './admin-page/CouponList';
import { ProductForm } from './admin-page/ProductForm';
import { ProductTable } from './admin-page/ProductTable';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export function AdminPage({
  products,
  coupons,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon,
  addNotification,
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const editProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
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
                onClick={() => {
                  setEditingProduct('new');
                  setProductForm({
                    name: '',
                    price: 0,
                    stock: 0,
                    description: '',
                    discounts: [],
                  });
                  setShowProductForm(true);
                }}
                className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <ProductTable
            activeTab={activeTab}
            products={products}
            onEdit={editProduct}
            onDelete={deleteProduct}
          />

          {showProductForm && (
            <ProductForm
              productForm={productForm}
              setProductForm={setProductForm}
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setEditingProduct(null);
                setShowProductForm(false);
              }}
              editingProduct={editingProduct}
              addNotification={addNotification}
            />
          )}
        </section>
      ) : (
        <section className='bg-white rounded-lg border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
          </div>
          <div className='p-6'>
            <CouponList
              coupons={coupons}
              deleteCoupon={deleteCoupon}
              toggleCouponForm={() => setShowCouponForm(!showCouponForm)}
            />

            {showCouponForm && (
              <CouponForm
                onSubmit={handleCouponSubmit}
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                closeCouponForm={() => setShowCouponForm(false)}
                addNotification={addNotification}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
