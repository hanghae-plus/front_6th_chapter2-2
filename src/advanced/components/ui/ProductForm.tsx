import type { NotificationVariant, ProductWithUI } from '../../constants';
import {
  convertPercentageToRate,
  convertRateToPercentage,
  isEmptyValue,
  isNumber,
  isValidMaximumStock,
  isValidMinimumStock,
  isValidPrice,
} from '../../shared/lib';
import { Icon } from '../icons';

interface ProductFormProps {
  isOpen: boolean;
  form: Omit<ProductWithUI, 'id'>;
  updateForm: (updates: Partial<ProductWithUI>) => void;
  editingProduct: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAddNotification: (message: string, type: Exclude<NotificationVariant, 'warning'>) => void;
}

export function ProductForm({
  isOpen,
  form,
  updateForm,
  editingProduct,
  onSubmit,
  onCancel,
  onAddNotification,
}: ProductFormProps) {
  if (!isOpen) return null;

  const isNewProduct = editingProduct === 'new';

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          {isNewProduct ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>상품명</label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>설명</label>
            <input
              type='text'
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>가격</label>
            <input
              type='text'
              value={form.price === 0 ? '' : form.price}
              onChange={(e) => {
                const { value } = e.target;
                if (isEmptyValue(value) || isNumber(value)) {
                  updateForm({ price: isEmptyValue(value) ? 0 : parseInt(value) });
                }
              }}
              onBlur={(e) => {
                const { value } = e.target;
                if (isEmptyValue(value)) {
                  updateForm({ price: 0 });
                } else if (!isValidPrice(parseInt(value))) {
                  onAddNotification('가격은 0보다 커야 합니다', 'error');
                  updateForm({ price: 0 });
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
              value={form.stock === 0 ? '' : form.stock}
              onChange={(e) => {
                const { value } = e.target;
                if (isEmptyValue(value) || isNumber(value)) {
                  updateForm({ stock: isEmptyValue(value) ? 0 : parseInt(value) });
                }
              }}
              onBlur={(e) => {
                const { value } = e.target;
                if (isEmptyValue(value)) {
                  updateForm({ stock: 0 });
                } else if (!isValidMinimumStock(parseInt(value))) {
                  onAddNotification('재고는 0보다 커야 합니다', 'error');
                  updateForm({ stock: 0 });
                } else if (!isValidMaximumStock(parseInt(value))) {
                  onAddNotification('재고는 9999개를 초과할 수 없습니다', 'error');
                  updateForm({ stock: 9999 });
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>
        </div>
        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>할인 정책</label>
          <div className='space-y-2'>
            {form.discounts.map((discount, index) => (
              <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                <input
                  type='number'
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...form.discounts];
                    newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                    updateForm({ discounts: newDiscounts });
                  }}
                  className='w-20 px-2 py-1 border rounded'
                  min='1'
                  placeholder='수량'
                />
                <span className='text-sm'>개 이상 구매 시</span>
                <input
                  type='number'
                  value={convertRateToPercentage(discount.rate)}
                  onChange={(e) => {
                    const newDiscounts = [...form.discounts];
                    newDiscounts[index].rate = convertPercentageToRate(
                      parseInt(e.target.value) || 0
                    );
                    updateForm({ discounts: newDiscounts });
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
                    const newDiscounts = form.discounts.filter((_, i) => i !== index);
                    updateForm({ discounts: newDiscounts });
                  }}
                  className='text-red-600 hover:text-red-800'
                >
                  <Icon name='x' width={16} height={16} />
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() => {
                updateForm({ discounts: [...form.discounts, { quantity: 10, rate: 0.1 }] });
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
            {isNewProduct ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
