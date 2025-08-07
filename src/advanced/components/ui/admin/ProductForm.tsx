import { FocusEvent } from 'react'
import { ProductForm as ProductItemForm } from '../../../../types'
import { MAX_DISCOUNT_RATE } from '../../../constants'

export function ProductForm({
  productForm,
  handleProductSubmit,
  editingProduct,
  handleAddDiscount,
  handleDeleteDiscount,
  handleEditProuctForm,
  handleAddOrCloseProductForm,
  handlePriceValidation,
  handleStockValidation,
}: {
  productForm: ProductItemForm
  handleProductSubmit: (e: React.FormEvent) => void
  editingProduct: string | null
  handleAddDiscount: () => void
  handleDeleteDiscount: (index: number) => void
  handleEditProuctForm: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index?: number,
  ) => void
  handleAddOrCloseProductForm: (
    type: string | null,
    isShowProductForm: boolean,
  ) => void
  handlePriceValidation: (e: FocusEvent<HTMLInputElement>) => void
  handleStockValidation: (e: FocusEvent<HTMLInputElement>) => void
}) {
  return (
    <>
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품명
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => handleEditProuctForm(e, 'name')}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <input
                type="text"
                value={productForm.description}
                onChange={(e) => handleEditProuctForm(e, 'description')}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격
              </label>
              <input
                type="text"
                value={productForm.price === 0 ? '' : productForm.price}
                onChange={(e) => handleEditProuctForm(e, 'price')}
                onBlur={handlePriceValidation}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                placeholder="숫자만 입력"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                재고
              </label>
              <input
                type="text"
                value={productForm.stock === 0 ? '' : productForm.stock}
                onChange={(e) => handleEditProuctForm(e, 'stock')}
                onBlur={handleStockValidation}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                placeholder="숫자만 입력"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              할인 정책
            </label>
            <div className="space-y-2">
              {productForm.discounts.map((discount, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                >
                  <input
                    type="number"
                    value={discount.quantity}
                    onChange={(e) => handleEditProuctForm(e, 'quantity', index)}
                    className="w-20 px-2 py-1 border rounded"
                    min="1"
                    placeholder="수량"
                  />
                  <span className="text-sm">개 이상 구매 시</span>
                  <input
                    type="number"
                    value={discount.rate * MAX_DISCOUNT_RATE}
                    onChange={(e) => handleEditProuctForm(e, 'rate', index)}
                    className="w-16 px-2 py-1 border rounded"
                    min="0"
                    max={MAX_DISCOUNT_RATE}
                    placeholder="%"
                  />
                  <span className="text-sm">% 할인</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDiscount(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDiscount}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + 할인 추가
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => handleAddOrCloseProductForm(null, false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              {editingProduct === 'new' ? '추가' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
