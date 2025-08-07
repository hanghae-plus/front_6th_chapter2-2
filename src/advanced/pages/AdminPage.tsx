import { useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import type { Coupon as CouponType } from '../../types';
import type { ProductWithUI } from '../shared/types';
import { MESSAGES } from '../constants/message';
import { useCouponForm } from '../hooks/useCouponForm';
import { CouponForm } from '../components/admin/CouponForm';
import CouponList from '../components/admin/CouponList';
import ProductForm from '../components/admin/ProductForm';
import { ProductList } from '../components/admin/ProductList';
import { useNotificationActions } from '../shared/hooks';
import { showProductFormAtom, startEditProductAtom, startAddProductAtom } from '../shared/atoms/productFormAtoms';

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: CouponType[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: CouponType) => void;
  deleteCoupon: (couponCode: string) => void;
  selectedCoupon: CouponType | null;
  selectCoupon: (coupon: CouponType | null) => void;
}

export function AdminPage({
  products,
  coupons,
  addProduct: addProductHook,
  updateProduct: updateProductHook,
  deleteProduct: deleteProductHook,
  addCoupon: addCouponHook,
  deleteCoupon: deleteCouponHook,
  selectedCoupon,
  selectCoupon,
}: AdminPageProps) {
  const { addNotification } = useNotificationActions();

  // ProductForm 관련 atoms
  const [showProductForm] = useAtom(showProductFormAtom);
  const [, startEditProduct] = useAtom(startEditProductAtom);
  const [, startAddProduct] = useAtom(startAddProductAtom);

  // CouponForm 관련 기존 로직 유지
  const {
    couponForm,
    updateName: updateCouponName,
    updateCode,
    updateDiscountType,
    updateDiscountValue,
    validateDiscountValue,
    submitForm: submitCouponForm,
  } = useCouponForm();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const toggleCouponForm = () => setShowCouponForm((prev) => !prev);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProductHook(newProduct);
      addNotification({ message: MESSAGES.PRODUCT.ADDED, type: 'success' });
    },
    [addProductHook, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProductHook(productId, updates);
      addNotification({ message: MESSAGES.PRODUCT.UPDATED, type: 'success' });
    },
    [updateProductHook, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      deleteProductHook(productId);
      addNotification({ message: MESSAGES.PRODUCT.DELETED, type: 'success' });
    },
    [deleteProductHook, addNotification],
  );

  const addCoupon = useCallback(
    (newCoupon: CouponType) => {
      addCouponHook(newCoupon);
      addNotification({ message: MESSAGES.COUPON.ADDED, type: 'success' });
    },
    [addCouponHook, addNotification],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCouponHook(couponCode);
      if (selectedCoupon?.code === couponCode) {
        selectCoupon(null);
      }
      addNotification({ message: MESSAGES.COUPON.DELETED, type: 'success' });
    },
    [deleteCouponHook, selectedCoupon, selectCoupon, addNotification],
  );

  // 상품 폼 제출 핸들러 - 대폭 단순화!
  const handleProductSubmit = useCallback(
    (productData: Omit<ProductWithUI, 'id'>, productId?: string) => {
      if (productId) {
        updateProduct(productId, productData);
      } else {
        addProduct(productData);
      }
    },
    [addProduct, updateProduct],
  );

  // 쿠폰 폼 제출 핸들러
  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      submitCouponForm(e, addCoupon, () => setShowCouponForm(false));
    },
    [submitCouponForm, addCoupon],
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
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
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <button
                onClick={startAddProduct}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <ProductList
            products={products}
            activeTab={activeTab}
            handleStartEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
          />

          {showProductForm && <ProductForm onSubmit={handleProductSubmit} />}
        </section>
      ) : (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <CouponList coupons={coupons} deleteCoupon={deleteCoupon} toggleCouponForm={toggleCouponForm} />

            {showCouponForm && (
              <CouponForm
                couponForm={couponForm}
                updateName={updateCouponName}
                updateCode={updateCode}
                updateDiscountType={updateDiscountType}
                updateDiscountValue={updateDiscountValue}
                validateDiscountValue={validateDiscountValue}
                handleCouponSubmit={handleCouponSubmit}
                toggleCouponForm={toggleCouponForm}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminPage;
