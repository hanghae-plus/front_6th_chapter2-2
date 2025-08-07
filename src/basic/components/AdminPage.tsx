// TODO: 관리자 페이지 컴포넌트
// 힌트:
// 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
// 2. 상품 추가/수정/삭제 기능
// 3. 쿠폰 생성 기능
// 4. 할인 규칙 설정
//
// 필요한 hooks:
// - useProducts: 상품 CRUD
// - useCoupons: 쿠폰 CRUD
//
// 하위 컴포넌트:
// - ProductForm: 새 상품 추가 폼
// - ProductAccordion: 상품 정보 표시 및 수정
// - CouponForm: 새 쿠폰 추가 폼
// - CouponList: 쿠폰 목록 표시
import React from 'react';
import { Coupon, ProductForm } from '../../types.ts';
import { ProductWithUI } from '../constants';
import { ProductsTab } from './admin/ProductsTab.tsx';
import { CouponTab } from './admin/CouponTab.tsx';

type AdminPageProps = {
  activeTab: 'products' | 'coupons';
  setActiveTab: React.Dispatch<React.SetStateAction<'products' | 'coupons'>>;
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  setProductForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  showProductForm: boolean;
  handleProductSubmit: (e: React.FormEvent) => void;
  products: ProductWithUI[];
  coupons: Coupon[];
  editingProduct: string | null;
  productForm: ProductForm;
  showCouponForm: boolean;
  couponForm: Coupon;
  deleteCoupon: (couponCode: string) => void;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  handleCouponSubmit: (e: React.FormEvent) => void;
  setCouponForm: React.Dispatch<React.SetStateAction<Coupon>>;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
  formatPrice: (price: number, productId?: string) => string;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
};

export function AdminPage({
  activeTab,
  setActiveTab,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  showProductForm,
  handleProductSubmit,
  products,
  coupons,
  editingProduct,
  productForm,
  showCouponForm,
  couponForm,
  deleteCoupon,
  setShowCouponForm,
  handleCouponSubmit,
  setCouponForm,
  addNotification,
  formatPrice,
  startEditProduct,
  deleteProduct,
}: AdminPageProps) {
  return (
    <>
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
          <ProductsTab
            setEditingProduct={setEditingProduct}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
            activeTab={activeTab}
            products={products}
            formatPrice={formatPrice}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
            showProductForm={showProductForm}
            handleProductSubmit={handleProductSubmit}
            editingProduct={editingProduct}
            productForm={productForm}
            addNotification={addNotification}
          ></ProductsTab>
        ) : (
          <CouponTab
            coupons={coupons}
            deleteCoupon={deleteCoupon}
            setShowCouponForm={setShowCouponForm}
            showCouponForm={showCouponForm}
            handleCouponSubmit={handleCouponSubmit}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            addNotification={addNotification}
          ></CouponTab>
        )}
      </div>
    </>
  );
}
