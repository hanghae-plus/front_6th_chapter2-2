import {
  CouponItemFormContext,
  ProductItemFormContext,
  useCouponForm,
  useProductForm,
} from '../hooks/useForm'
import { useContext, useState } from 'react'
import { AdminHeader } from './ui/admin/AdminHeader'
import { ProductForm } from './ui/admin/ProductForm'
import { CouponForm } from './ui/admin/CouponForm'
import { CouponList } from './ui/admin/CouponList'
import { ProductAccordion } from './ui/admin/ProductAccordion'
import { ProductsContext } from '../hooks/useProducts'
import { CouponContext, ProductContext } from '../types/context'
import { CouponsContext } from '../hooks/useCoupons'

export function AdminPage({
  isAdmin,
  setIsAdmin,
  addNotification,
}: {
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products')
  const { addProduct, updateProduct } = useContext(
    ProductsContext,
  ) as ProductContext
  const { addCoupon } = useContext(CouponsContext) as CouponContext
  const {
    couponForm,
    handleEditCouponForm,
    showCouponForm,
    toggleShowCouponForm,
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
            <ProductItemFormContext.Provider
              value={{
                productForm,
                handleProductSubmit,
                editingProduct,
                handleAddDiscount,
                handleDeleteDiscount,
                handleEditProuctForm,
                handleAddOrCloseProductForm,
                handlePriceValidation,
                handleStockValidation,
                startEditProduct,
              }}
            >
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

                <ProductAccordion />
                {showProductForm && <ProductForm />}
              </section>
            </ProductItemFormContext.Provider>
          ) : (
            <CouponItemFormContext.Provider
              value={{
                couponForm,
                handleCouponSubmit,
                toggleShowCouponForm,
                handleEditCouponForm,
                handleDiscountValueValidation,
              }}
            >
              <section className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">쿠폰 관리</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CouponList />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                      <button
                        onClick={() => toggleShowCouponForm()}
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

                  {showCouponForm && <CouponForm />}
                </div>
              </section>
            </CouponItemFormContext.Provider>
          )}
        </div>
      </main>
    </>
  )
}
