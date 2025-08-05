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

import { useCallback, useState } from 'react';

import type { Coupon, NotificationVariant } from '../../types';
import { ProductWithUI } from '../constants';
import { AdminHeader } from './ui/AdminHeader';
import { ProductAccordion } from './ui/ProductAccordion';
import { ProductForm } from './ui/ProductForm';
import { TabNavigation } from './ui/TabNavigation';
import { initialProductForm, type ProductForm as ProductFormType } from '../models/product';
import { CouponList } from './ui/CouponList';
import { type CouponForm as CouponFormType, initialCouponForm } from '../models/coupon';
import { CouponAddButton } from './ui/CouponAddButton';
import { CouponForm } from './ui/CouponForm';
import { useForm } from '../utils/hooks/useForm';

interface AdminPageProps {
  setIsAdmin: (isAdmin: boolean) => void;
  addNotification: (message: string, type: NotificationVariant) => void;

  products: ProductWithUI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;

  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;

  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export function AdminPage({
  setIsAdmin,
  addNotification,

  products,
  setProducts,

  coupons,
  setCoupons,

  selectedCoupon,
  setSelectedCoupon,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const [showProductForm, setShowProductForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productFormData, updateProductFormData, resetProductFormData] =
    useForm<ProductFormType>(initialProductForm);

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponFormData, updateCouponFormData, resetCouponFormData] =
    useForm<CouponFormType>(initialCouponForm);

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    updateProductFormData(product);
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productFormData);
      setEditingProduct(null);
    } else {
      addProduct(productFormData);
    }
    resetProductFormData();
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponFormData);
    resetCouponFormData();
    setShowCouponForm(false);
  };

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

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
                    onClick={() => {
                      setEditingProduct('new');
                      resetProductFormData();
                      setShowProductForm(true);
                    }}
                    className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
                  >
                    새 상품 추가
                  </button>
                </div>
              </div>

              <ProductAccordion
                products={products}
                onEdit={startEditProduct}
                onDelete={deleteProduct}
              />

              <ProductForm
                isOpen={showProductForm}
                editingProduct={editingProduct}
                form={productFormData}
                updateForm={updateProductFormData}
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setEditingProduct(null);
                  resetProductFormData();
                  setShowProductForm(false);
                }}
                addNotification={addNotification}
              />
            </section>
          ) : (
            <section className='bg-white rounded-lg border border-gray-200'>
              <div className='p-6 border-b border-gray-200'>
                <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <CouponList coupons={coupons} onDelete={deleteCoupon} />

                  <CouponAddButton onAddNew={() => setShowCouponForm(true)} />
                </div>

                <CouponForm
                  isOpen={showCouponForm}
                  form={couponFormData}
                  updateForm={updateCouponFormData}
                  onSubmit={handleCouponSubmit}
                  onCancel={() => setShowCouponForm(false)}
                  addNotification={addNotification}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
