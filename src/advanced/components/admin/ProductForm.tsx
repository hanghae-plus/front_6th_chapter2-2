import type { ProductFormData as ProductFormDataType } from '../../../types';
import { useNotificationActions } from '../../shared/hooks';
import { CloseIcon } from '../icons';

interface ProductFormProps {
  editingProduct: string | null;
  productForm: ProductFormDataType;
  updateProductName: (name: string) => void;
  updateDescription: (description: string) => void;
  updatePrice: (price: string) => void;
  updateStock: (stock: string) => void;
  validatePriceValue: (price: string, callback: (message: string) => void) => void;
  validateStockValue: (stock: string, callback: (message: string) => void) => void;
  addDiscountPolicy: () => void;
  removeDiscountPolicy: (index: number) => void;
  updateDiscountQuantity: (index: number, quantity: number) => void;
  updateDiscountRate: (index: number, rate: number) => void;
  handleCancelProductForm: () => void;
  handleProductSubmit: (e: React.FormEvent) => void;
}

export function ProductForm({
  editingProduct,
  productForm,
  updateProductName,
  updateDescription,
  updatePrice,
  updateStock,
  validatePriceValue,
  validateStockValue,
  addDiscountPolicy,
  removeDiscountPolicy,
  updateDiscountQuantity,
  updateDiscountRate,
  handleCancelProductForm,
  handleProductSubmit,
}: ProductFormProps) {
  const { addNotification } = useNotificationActions();

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 상품명 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => updateProductName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>

          {/* 설명 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={productForm.description}
              onChange={(e) => updateDescription(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>

          {/* 가격 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
            <input
              type="text"
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={(e) => updatePrice(e.target.value)}
              onBlur={(e) =>
                validatePriceValue(e.target.value, (message) => addNotification({ message, type: 'error' }))
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>

          {/* 재고 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <input
              type="text"
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={(e) => updateStock(e.target.value)}
              onBlur={(e) =>
                validateStockValue(e.target.value, (message) => addNotification({ message, type: 'error' }))
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>

        {/* 할인 정책 섹션 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => updateDiscountQuantity(index, parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => updateDiscountRate(index, (parseInt(e.target.value) || 0) / 100)}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => removeDiscountPolicy(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button type="button" onClick={addDiscountPolicy} className="text-sm text-indigo-600 hover:text-indigo-800">
              + 할인 추가
            </button>
          </div>
        </div>

        {/* 폼 버튼들 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelProductForm}
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
  );
}

export default ProductForm;
