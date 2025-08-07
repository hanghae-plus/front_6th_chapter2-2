import { Product } from '../../../shared/types';
import { initialProductForm } from '../../../shared/constants';
import { ProductDiscountItem } from './ProductDiscountItem';
import { useProducts } from '../../../shared/hooks/useProducts';
import { useNotification } from '../../../shared/hooks/useNotification';

export const ProductForm = ({
  setShowProductForm,
  productForm,
  setProductForm,
}: {
  setShowProductForm: (show: boolean) => void;
  productForm: Product;
  setProductForm: (product: Product) => void;
}) => {
  const { addProduct, updateProduct } = useProducts();
  const { addNotification } = useNotification();

  // 상품 제출
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.id) {
      updateProduct(productForm);
    } else {
      addProduct(productForm);
    }
    setProductForm(initialProductForm);
    setShowProductForm(false);
  };

  // 상품 변경
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  // #region 상품 정보 변경
  // 가격 변경
  const changePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setProductForm({
        ...productForm,
        price: value === '' ? 0 : parseInt(value),
      });
    }
  };

  // 가격 포커스 아웃
  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setProductForm({ ...productForm, price: 0 });
    } else if (parseInt(value) < 0) {
      addNotification('가격은 0보다 커야 합니다', 'error');
      setProductForm({ ...productForm, price: 0 });
    }
  };

  // 재고 변경
  const changeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setProductForm({
        ...productForm,
        stock: value === '' ? 0 : parseInt(value),
      });
    }
  };

  // 재고 포커스 아웃
  const handleStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setProductForm({ ...productForm, stock: 0 });
    } else if (parseInt(value) < 0) {
      addNotification('재고는 0보다 커야 합니다', 'error');
      setProductForm({ ...productForm, stock: 0 });
    } else if (parseInt(value) > 9999) {
      addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
      setProductForm({ ...productForm, stock: 9999 });
    }
  };

  // 할인 추가
  const addDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  // 할인 제거
  const removeDiscount = (index: number) => {
    setProductForm({
      ...productForm,
      discounts: productForm.discounts.filter((_, i) => i !== index),
    });
  };

  // 할인 퍼센트 변경
  const changeDiscountRate = (index: number, percent: number) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index].rate = (percent || 0) / 100;
    setProductForm({ ...productForm, discounts: newDiscounts });
  };

  // 할인 수량 변경
  const changeDiscountQuantity = (index: number, quantity: number) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index].quantity = quantity;
    setProductForm({ ...productForm, discounts: newDiscounts });
  };
  // #endregion

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {productForm.id ? '상품 수정' : '새 상품 추가'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 상품명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              name="name"
              type="text"
              value={productForm.name}
              onChange={handleProductChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              name="description"
              type="text"
              value={productForm.description}
              onChange={handleProductChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              name="price"
              type="text"
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={changePrice}
              onBlur={handlePriceBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>

          {/* 재고 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <input
              name="stock"
              type="text"
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={changeStock}
              onBlur={handleStockBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>

        {/* 할인 정책 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <ProductDiscountItem
                key={index}
                discount={discount}
                index={index}
                changeDiscountQuantity={changeDiscountQuantity}
                changeDiscountRate={changeDiscountRate}
                removeDiscount={removeDiscount}
              />
            ))}
            <button
              type="button"
              onClick={addDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setProductForm(initialProductForm);
              setShowProductForm(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {productForm.id ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  );
};
