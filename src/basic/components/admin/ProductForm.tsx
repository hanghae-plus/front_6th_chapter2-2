import CloseIcon from '../icons/CloseIcon';

interface ProductFormProps {
  productForm: any;
}

const ProductForm = ({ productForm }: ProductFormProps) => {
  const {
    editingProduct,
    formData,
    handleSubmit,
    updateFormData,
    addDiscount,
    removeDiscount,
    updateDiscount,
    validatePrice,
    validateStock,
    resetForm
  } = productForm;

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => updateFormData({ name: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => updateFormData({ description: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
            <input
              type="text"
              value={formData.price === 0 ? '' : formData.price}
              onChange={e => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  updateFormData({ price: value === '' ? 0 : parseInt(value) });
                }
              }}
              onBlur={e => validatePrice(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <input
              type="text"
              value={formData.stock === 0 ? '' : formData.stock}
              onChange={e => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  updateFormData({ stock: value === '' ? 0 : parseInt(value) });
                }
              }}
              onBlur={e => validateStock(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {formData.discounts.map((discount: any, index: number) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={e => updateDiscount(index, { quantity: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={e => updateDiscount(index, { rate: (parseInt(e.target.value) || 0) / 100 })}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button type="button" onClick={() => removeDiscount(index)} className="text-red-600 hover:text-red-800">
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button type="button" onClick={addDiscount} className="text-sm text-indigo-600 hover:text-indigo-800">
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
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
};

export default ProductForm;
