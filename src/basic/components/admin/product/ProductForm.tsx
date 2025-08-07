import { Dispatch, SetStateAction } from "react";
import { NewProductForm } from "../../../types/product";
import { useProductFormHandlers } from "../../../hooks/useProductFormHandlers";
import { MAX_DESCRIPTION_LENGTH, MAX_PRODUCT_NAME_LENGTH } from "../../../utils/productUtils";

interface IProductFormProps {
  productForm: NewProductForm;
  editingProduct: string | null;
  handleProductSubmit: (e: React.FormEvent) => void;
  setProductForm: Dispatch<SetStateAction<NewProductForm>>;
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
}
const ProductForm = ({ productForm, editingProduct, handleProductSubmit, setProductForm, setEditingProduct, setShowProductForm }: IProductFormProps) => {
  /** 상품 폼 핸들러 사용 */
  const {
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
    handleDiscountQuantityChange,
    handleDiscountRateChange,
    handleRemoveDiscount,
    handleAddDiscount,
    handleCancel,
  } = useProductFormHandlers({
    setProductForm,
    setEditingProduct,
    setShowProductForm,
  });

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{editingProduct === "new" ? "새 상품 추가" : "상품 수정"}</h3>

        {/* 기본 정보 입력 필드들 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 상품명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={handleNameChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
              maxLength={MAX_PRODUCT_NAME_LENGTH}
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={productForm.description}
              onChange={handleDescriptionChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productForm.price === 0 ? "" : productForm.price}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>

          {/* 재고 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productForm.stock === 0 ? "" : productForm.stock}
              onChange={handleStockChange}
              onBlur={handleStockBlur}
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
            {/* 기존 할인 정책들 */}
            {productForm.discounts.map((discount, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => handleDiscountQuantityChange(index, e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => handleDiscountRateChange(index, e.target.value)}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button type="button" onClick={() => handleRemoveDiscount(index)} className="text-red-600 hover:text-red-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {/* 할인 추가 버튼 */}
            <button type="button" onClick={handleAddDiscount} className="text-sm text-indigo-600 hover:text-indigo-800">
              + 할인 추가
            </button>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            취소
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            {editingProduct === "new" ? "추가" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
