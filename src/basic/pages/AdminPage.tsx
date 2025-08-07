import { useState, useCallback } from 'react';
import type { Coupon as CouponType } from '../../types';
import type { ProductWithUI } from '../shared/types';
import { formatKoreanPrice } from '../shared/utils';
import { MESSAGES } from '../constants/message';
import { useCouponForm } from '../hooks/useCouponForm';
import { CouponForm } from '../components/admin/CouponForm';
import CouponList from '../components/admin/CouponList';
import { useProductForm } from '../hooks/useProductForm';
import ProductForm from '../components/admin/ProductForm';

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: CouponType[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: CouponType) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
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
  addNotification,
  selectedCoupon,
  selectCoupon,
}: AdminPageProps) {
  // 쿠폰 폼 훅
  const {
    couponForm,
    updateName: updateCouponName,
    updateCode,
    updateDiscountType,
    updateDiscountValue,
    validateDiscountValue,
    submitForm: submitCouponForm,
  } = useCouponForm();

  const {
    productForm,
    editingProduct,
    updateName: updateProductName,
    updateDescription,
    updatePrice,
    updateStock,
    validatePriceValue,
    validateStockValue,
    addDiscountPolicy,
    removeDiscountPolicy,
    updateDiscountQuantity,
    updateDiscountRate,
    startEditProduct: startEditProductHook,
    startAddProduct,
    submitForm: submitProductForm,
    resetForm: resetProductForm,
  } = useProductForm();

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  const toggleCouponForm = () => setShowCouponForm((prev) => !prev);
  const toggleProductForm = () => setShowProductForm((prev) => !prev);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProductHook(newProduct);
      addNotification(MESSAGES.PRODUCT.ADDED, 'success');
    },
    [addProductHook, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProductHook(productId, updates);
      addNotification(MESSAGES.PRODUCT.UPDATED, 'success');
    },
    [updateProductHook, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      deleteProductHook(productId);
      addNotification(MESSAGES.PRODUCT.DELETED, 'success');
    },
    [deleteProductHook, addNotification],
  );

  const addCoupon = useCallback(
    (newCoupon: CouponType) => {
      addCouponHook(newCoupon);
      addNotification(MESSAGES.COUPON.ADDED, 'success');
    },
    [addCouponHook, addNotification],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCouponHook(couponCode);
      if (selectedCoupon?.code === couponCode) {
        selectCoupon(null);
      }
      addNotification(MESSAGES.COUPON.DELETED, 'success');
    },
    [deleteCouponHook, selectedCoupon, selectCoupon, addNotification],
  );

  // 상품 폼 제출 핸들러 - Hook의 submitForm 사용
  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      submitProductForm(
        e,
        (productData, productId) => {
          if (productId) {
            updateProduct(productId, productData);
          } else {
            addProduct(productData);
          }
        },
        () => setShowProductForm(false),
      );
    },
    [submitProductForm, addProduct, updateProduct],
  );

  // 쿠폰 폼 제출 핸들러
  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      submitCouponForm(e, addCoupon, () => setShowCouponForm(false));
    },
    [submitCouponForm, addCoupon],
  );

  // 상품 편집 시작 핸들러
  const handleStartEditProduct = useCallback(
    (product: ProductWithUI) => {
      startEditProductHook(product);
      setShowProductForm(true);
    },
    [startEditProductHook],
  );

  // 새 상품 추가 시작 핸들러
  const handleStartAddProduct = useCallback(() => {
    startAddProduct();
    setShowProductForm(true);
  }, [startAddProduct]);

  // 상품 폼 취소 핸들러
  const handleCancelProductForm = useCallback(() => {
    resetProductForm();
    setShowProductForm(false);
  }, [resetProductForm]);

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
                onClick={handleStartAddProduct}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    설명
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === 'products' ? products : products).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatKoreanPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}개
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStartEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showProductForm && (
            <ProductForm
              editingProduct={editingProduct}
              productForm={productForm}
              updateProductName={updateProductName}
              updateDescription={updateDescription}
              updatePrice={updatePrice}
              updateStock={updateStock}
              validatePriceValue={validatePriceValue}
              validateStockValue={validateStockValue}
              addDiscountPolicy={addDiscountPolicy}
              removeDiscountPolicy={removeDiscountPolicy}
              updateDiscountQuantity={updateDiscountQuantity}
              updateDiscountRate={updateDiscountRate}
              handleCancelProductForm={handleCancelProductForm}
              handleProductSubmit={handleProductSubmit}
              addNotification={addNotification}
            />
          )}
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
                addNotification={addNotification}
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
