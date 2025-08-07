// 힌트:
// 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
// 2. 상품 추가/수정/삭제 기능
// 3. 쿠폰 생성 기능
// 4. 할인 규칙 설정
//
// 필요한 hooks:
// - useProducts: 상품 CRUD
// - useCoupons: 쿠폰 CRUD

import { CartItem, Coupon } from '../../types'
import { ProductWithUI } from '../types'
import { useCouponForm, useProductForm } from '../hooks/useForm'
import { useState } from 'react'
import { AdminHeader } from './ui/admin/AdminHeader'
import { ProductForm } from './ui/admin/ProductForm'
import { CouponForm } from './ui/admin/CouponForm'
import { CouponList } from './ui/admin/CouponList'
import { ProductAccordion } from './ui/admin/ProductAccordion'

export function AdminPage({
  isAdmin,
  cart,
  setIsAdmin,
  products,
  deleteProduct,
  addNotification,
  coupons,
  deleteCoupon,
  updateProduct,
  addProduct,
  addCoupon,
  getRemainingStock,
}: {
  isAdmin: boolean
  cart: CartItem[]
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  products: ProductWithUI[]
  deleteProduct: (productId: string) => void
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void
  coupons: Coupon[]
  deleteCoupon: (couponCode: string) => void
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void
  addCoupon: (newCoupon: Coupon) => void
  getRemainingStock: (product: ProductWithUI) => number
}) {
  // TODO: 구현
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products')
  const {
    couponForm,
    handleEditCouponForm,
    showCouponForm,
    setShowCouponForm,
    handleCouponSubmit,
    handleDiscountValueValidation,
  } = useCouponForm(addCoupon, addNotification)
  const {
    productForm,
    startEditProduct,
    handleProductSubmit,
    showProductForm,
    editingProduct,
    handleAddOrCloseProductForm,
    handleAddDiscount,
    handleDeleteDiscount,
    handleEditProuctForm,
    handlePriceValidation,
    handleStockValidation,
  } = useProductForm(addProduct, updateProduct, addNotification)

  const productFormProps = {
    productForm,
    handleProductSubmit,
    editingProduct,
    handleAddDiscount,
    handleDeleteDiscount,
    handleEditProuctForm,
    handleAddOrCloseProductForm,
    handlePriceValidation,
    handleStockValidation,
  }

  const productAccordionProps = {
    products,
    cart,
    startEditProduct,
    deleteProduct,
    getRemainingStock,
  }

  const cuponFormProps = {
    couponForm,
    handleCouponSubmit,
    setShowCouponForm,
    handleEditCouponForm,
    handleDiscountValueValidation,
  }

  return (
    <>
      <AdminHeader isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 mt-1">
              상품과 쿠폰을 관리할 수 있습니다
            </p>
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
                    onClick={() => handleAddOrCloseProductForm('new', true)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                  >
                    새 상품 추가
                  </button>
                </div>
              </div>

              <ProductAccordion {...productAccordionProps} />
              {showProductForm && <ProductForm {...productFormProps} />}
            </section>
          ) : (
            <section className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">쿠폰 관리</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <CouponList coupons={coupons} deleteCoupon={deleteCoupon} />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <button
                      onClick={() => setShowCouponForm(!showCouponForm)}
                      className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                    </button>
                  </div>
                </div>

                {showCouponForm && <CouponForm {...cuponFormProps} />}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
