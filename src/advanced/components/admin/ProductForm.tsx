import { useAtom, useSetAtom } from 'jotai';

import {
  pushNotificationAtom,
  productFormAtom,
  editingProductIdAtom,
  showProductFormAtom,
  addProductAtom,
  updateProductAtom,
} from '../../store/atoms';
import { parseIntOrZero, isDigitsOnly } from '../../utils/validators';

export default function ProductForm() {
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [editingProduct] = useAtom(editingProductIdAtom);

  const pushNotification = useSetAtom(pushNotificationAtom);
  const setShowProductForm = useSetAtom(showProductFormAtom);
  const addProduct = useSetAtom(addProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);

  const onCancel = () => {
    setShowProductForm(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct({ productId: editingProduct, updates: productForm });
      pushNotification({ message: '상품이 수정되었습니다.', type: 'success' });
    } else {
      addProduct({ ...productForm, discounts: productForm.discounts });
      pushNotification({ message: '상품이 추가되었습니다.', type: 'success' });
    }
    setShowProductForm(false);
  };

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>상품명</label>
            <input
              type='text'
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>설명</label>
            <input
              type='text'
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>가격</label>
            <input
              type='text'
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={(e) => {
                const { value } = e.target;
                if (value === '' || isDigitsOnly(value)) {
                  setProductForm({ ...productForm, price: value === '' ? 0 : parseInt(value) });
                }
              }}
              onBlur={(e) => {
                const { value } = e.target;
                if (value === '') {
                  setProductForm({ ...productForm, price: 0 });
                } else if (parseInt(value) < 0) {
                  pushNotification({ message: '가격은 0보다 커야 합니다', type: 'error' });
                  setProductForm({ ...productForm, price: 0 });
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>재고</label>
            <input
              type='text'
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: parseIntOrZero(e.target.value) })
              }
              onBlur={(e) => {
                const { value } = e.target;
                if (value === '') {
                  setProductForm({ ...productForm, stock: 0 });
                } else if (parseInt(value) < 0) {
                  pushNotification({ message: '재고는 0보다 커야 합니다', type: 'error' });
                  setProductForm({ ...productForm, stock: 0 });
                } else if (parseInt(value) > 9999) {
                  pushNotification({
                    message: '재고는 9999개를 초과할 수 없습니다',
                    type: 'error',
                  });
                  setProductForm({ ...productForm, stock: 9999 });
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>
        </div>

        {/* 할인 정책 섹션 */}
        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>할인 정책</label>
          <div className='space-y-2'>
            {productForm.discounts.map((discount, index) => (
              <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                <input
                  type='number'
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  className='w-20 px-2 py-1 border rounded'
                  min='1'
                  placeholder='수량'
                />
                <span className='text-sm'>개 이상 구매 시</span>
                <input
                  type='number'
                  value={discount.rate * 100}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  className='w-16 px-2 py-1 border rounded'
                  min='0'
                  max='100'
                  placeholder='%'
                />
                <span className='text-sm'>% 할인</span>
                <button
                  type='button'
                  onClick={() => {
                    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  className='text-red-600 hover:text-red-800'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() => {
                setProductForm({
                  ...productForm,
                  discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
                });
              }}
              className='text-sm text-indigo-600 hover:text-indigo-800'
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            취소
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'
          >
            {editingProduct === 'new' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
