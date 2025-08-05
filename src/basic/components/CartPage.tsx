// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱

import { useEffect, useState } from 'react'
import { CartItem, Coupon } from '../../types'
import { ProductWithUI } from '../types'
import { CartHeader } from './ui/CartHeader'
import { ProductList } from './ui/ProductList'
import { Cart } from './ui/Cart'
import { useDebounce } from '../utils/hooks/useDebounce'

export function CartPage({
  isAdmin,
  setIsAdmin,
  products,
  cart,
  coupons,
  totals,
  selectedCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  completeOrder,
  handleSelectCoupon,
  getFilteredProducts,
}: {
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  products: ProductWithUI[]
  cart: CartItem[]
  coupons: Coupon[]
  totals: {
    totalBeforeDiscount: number
    totalAfterDiscount: number
  }
  selectedCoupon: Coupon | null
  addToCart: (product: ProductWithUI) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: ProductWithUI[],
  ) => void
  completeOrder: () => void
  handleSelectCoupon: (
    e: React.ChangeEvent<HTMLSelectElement>,
    coupons: Coupon[],
  ) => void
  getFilteredProducts: (searchTerm: string) => ProductWithUI[]
}) {
  // TODO: 구현
  const [searchTerm, setSearchTerm] = useState('')
  const [totalItemCount, setTotalItemCount] = useState(0)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    setTotalItemCount(count)
  }, [cart])

  const filteredProducts = getFilteredProducts(debouncedSearchTerm)

  const headerState = {
    isAdmin,
    searchTerm,
    cart,
    totalItemCount,
    setSearchTerm,
    setIsAdmin,
  }

  const cartProps = {
    cart,
    coupons,
    products,
    selectedCoupon,
    removeFromCart,
    updateQuantity,
    totals,
    completeOrder,
    handleSelectCoupon,
  }

  return (
    <>
      <CartHeader {...headerState}></CartHeader>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* 상품 목록 */}
            <section>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  전체 상품
                </h2>
                <div className="text-sm text-gray-600">
                  총 {products.length}개 상품
                </div>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                  </p>
                </div>
              ) : (
                <ProductList
                  filteredProducts={filteredProducts}
                  cart={cart}
                  addToCart={addToCart}
                />
              )}
            </section>
          </div>

          <Cart {...cartProps} />
        </div>
      </main>
    </>
  )
}
