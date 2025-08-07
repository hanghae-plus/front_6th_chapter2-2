import { useContext, useState } from 'react'
import { CartHeader } from './ui/cart/CartHeader'
import { ProductList } from './ui/cart/ProductList'
import { Cart } from './ui/cart/Cart'
import { useDebounce } from '../utils/hooks/useDebounce'
import { ProductContext } from '../types/context'
import { ProductsContext } from '../hooks/useProducts'

export function CartPage({
  isAdmin,
  setIsAdmin,
}: {
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { products, getFilteredProducts } = useContext(
    ProductsContext,
  ) as ProductContext
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const filteredProducts = getFilteredProducts(debouncedSearchTerm)

  return (
    <>
      <CartHeader
        {...{
          isAdmin,
          setIsAdmin,
          searchTerm,
          setSearchTerm,
        }}
      />
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
                <ProductList filteredProducts={filteredProducts} />
              )}
            </section>
          </div>

          <Cart />
        </div>
      </main>
    </>
  )
}
