import { useSetAtom } from 'jotai';
import Button from '../../ui/Button';
import IconButton from '../../ui/IconButton';
import { DeleteIcon } from '../../ui/Icons';
import Input from '../../ui/Input';
import { addNotificationAtom } from '../../../atoms/notificationsAtoms';
import { useProductForm } from '../../../hooks/product/useProductForm';
import { useEffect } from 'react';

interface ProductFormProps {
  onToggleForm: (show: boolean) => void;
}

export default function ProductForm({ onToggleForm }: ProductFormProps) {
  const addNotification = useSetAtom(addNotificationAtom);
  const { handleProductSubmit, setProductForm, productForm, editingProduct, setEditingProduct } =
    useProductForm();

  // ProductForm이 마운트될 때 editingProduct가 null이면 'new' 모드로 설정
  useEffect(() => {
    if (editingProduct === null) {
      setEditingProduct('new');
    }
  }, [editingProduct, setEditingProduct]);

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
              required
              type='text'
              value={productForm.price.toString()}
              onChange={(e) => {
                const value = e.target.value;
                // 빈 문자열이거나 숫자로만 구성된 경우에만 허용
                if (value === '' || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    price: value === '' ? 0 : parseInt(value),
                  });
                }
                // 잘못된 입력은 무시 (이전 값 유지)
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
              setEditingProduct(null);
              setProductForm({
                name: '',
                price: 0,
                stock: 0,
                description: '',
                discounts: [],
              });
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
