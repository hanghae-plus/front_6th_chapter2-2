import { useSetAtom } from 'jotai';
import Button from '../../ui/Button';
import IconButton from '../../ui/IconButton';
import { DeleteIcon } from '../../ui/Icons';
import Input from '../../ui/Input';
import { addNotificationAtom } from '../../../atoms/notificationsAtom';
import { useProductForm } from '../../../hooks/product/useProductForm';
import { useEffect } from 'react';

interface ProductFormProps {
  onToggleForm: (show: boolean) => void;
  editingProduct?: string | null;
  initialFormData?: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: { quantity: number; rate: number }[];
  };
}

export default function ProductForm({
  onToggleForm,
  editingProduct: propEditingProduct,
  initialFormData,
}: ProductFormProps) {
  const addNotification = useSetAtom(addNotificationAtom);
  const { handleProductSubmit, setProductForm, productForm, editingProduct, setEditingProduct } =
    useProductForm();

  useEffect(() => {
    if (propEditingProduct && initialFormData) {
      setEditingProduct(propEditingProduct);
      setProductForm(initialFormData);
    } else if (propEditingProduct === 'new') {
      setEditingProduct('new');
      setProductForm({
        name: '',
        price: 0,
        stock: 0,
        description: '',
        discounts: [],
      });
    }
  }, [propEditingProduct, initialFormData, setEditingProduct, setProductForm]);

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form
        onSubmit={(e) => {
          handleProductSubmit(e, () => onToggleForm(false));
        }}
        className='space-y-4'
      >
        <h3 className='text-lg font-medium text-gray-900'>
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>상품명</label>
            <Input
              type='text'
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>설명</label>
            <Input
              type='text'
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>가격</label>
            <Input
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
                  addNotification({ message: '가격은 0보다 커야 합니다', type: 'error' });
                  setProductForm({ ...productForm, price: 0 });
                }
              }}
              placeholder='숫자만 입력'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>재고</label>
            <Input
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
                  addNotification({ message: '재고는 0보다 커야 합니다', type: 'error' });
                  setProductForm({ ...productForm, stock: 0 });
                } else if (parseInt(value) > 9999) {
                  addNotification({ message: '재고는 9999개를 초과할 수 없습니다', type: 'error' });
                  setProductForm({ ...productForm, stock: 9999 });
                }
              }}
              placeholder='숫자만 입력'
              required
            />
          </div>
        </div>
        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>할인 정책</label>
          <div className='space-y-2'>
            {productForm.discounts.map((discount, index) => (
              <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                <Input
                  type='number'
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  size='sm'
                  min='1'
                  placeholder='수량'
                />
                <span className='text-sm'>개 이상 구매 시</span>
                <Input
                  type='number'
                  value={discount.rate * 100}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  size='xs'
                  min='0'
                  max='100'
                  placeholder='%'
                />
                <span className='text-sm'>% 할인</span>

                <IconButton
                  variant='error'
                  type='button'
                  onClick={() => {
                    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  icon={<DeleteIcon />}
                />
              </div>
            ))}

            <Button
              type='button'
              onClick={() => {
                setProductForm({
                  ...productForm,
                  discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
                });
              }}
              variant='link'
              className='text-sm text-indigo-600 hover:text-indigo-800'
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            onClick={() => {
              onToggleForm(false);
            }}
            variant='outline'
          >
            취소
          </Button>

          <Button type='submit' variant='primary' className='bg-indigo-600 text-white'>
            {editingProduct === 'new' ? '추가' : '수정'}
          </Button>
        </div>
      </form>
    </div>
  );
}
