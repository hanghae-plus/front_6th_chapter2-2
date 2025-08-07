import { FormEvent } from 'react';
import { Button } from '../../../../shared/ui';
import { useNotification } from '../../../../shared/utils';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

interface ProductFormProps {
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export default function ProductForm({
  productForm,
  setProductForm,
  onSubmit,
  onCancel,
  isEditing,
}: ProductFormProps) {
  const { addNotification } = useNotification();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const addDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  const removeDiscount = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const updateDiscount = (
    index: number,
    field: 'quantity' | 'rate',
    value: number
  ) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index][field] = value;
    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          {isEditing ? '상품 수정' : '새 상품 추가'}
        </h3>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              상품명
            </label>
            <input
              type='text'
              value={productForm.name}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  name: e.target.value,
                })
              }
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              설명
            </label>
            <input
              type='text'
              value={productForm.description}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              가격
            </label>
            <input
              type='text'
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    price: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setProductForm({ ...productForm, price: 0 });
                } else if (parseInt(value) < 0) {
                  addNotification('가격은 0보다 커야 합니다', 'error');
                  setProductForm({ ...productForm, price: 0 });
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              재고
            </label>
            <input
              type='text'
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    stock: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setProductForm({ ...productForm, stock: 0 });
                } else if (parseInt(value) < 0) {
                  addNotification('재고는 0보다 커야 합니다', 'error');
                  setProductForm({ ...productForm, stock: 0 });
                } else if (parseInt(value) > 9999) {
                  addNotification(
                    '재고는 9999개를 초과할 수 없습니다',
                    'error'
                  );
                  setProductForm({ ...productForm, stock: 9999 });
                }
              }}
              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
              placeholder='숫자만 입력'
              required
            />
          </div>
        </div>

        {/* 할인 정책 관리 */}
        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            할인 정책
          </label>
          <div className='space-y-2'>
            {productForm.discounts.map((discount, index) => (
              <div
                key={index}
                className='flex items-center gap-2 bg-gray-50 p-2 rounded'
              >
                <input
                  type='number'
                  value={discount.quantity}
                  onChange={(e) => {
                    updateDiscount(
                      index,
                      'quantity',
                      parseInt(e.target.value) || 0
                    );
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
                    updateDiscount(
                      index,
                      'rate',
                      (parseInt(e.target.value) || 0) / 100
                    );
                  }}
                  className='w-16 px-2 py-1 border rounded'
                  min='0'
                  max='100'
                  placeholder='%'
                />
                <span className='text-sm'>% 할인</span>
                <Button
                  type='button'
                  onClick={() => removeDiscount(index)}
                  variant='danger'
                  size='sm'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </Button>
              </div>
            ))}
            <Button
              type='button'
              onClick={addDiscount}
              variant='link'
              size='md'
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button type='button' onClick={onCancel} variant='ghost' size='md'>
            취소
          </Button>
          <Button type='submit' variant='secondary' size='md'>
            {isEditing ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </div>
  );
}
