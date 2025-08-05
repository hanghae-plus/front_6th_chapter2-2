import { ProductFormType } from '../../../../types';
import Button from '../../ui/Button';
import IconButton from '../../ui/IconButton';
import { DeleteIcon } from '../../ui/Icons';
import Input from '../../ui/Input';

interface ProductFormProps {
  handleProductSubmit: (e: React.FormEvent, callback: () => void) => void;
  onToggleForm: (show: boolean) => void;
  editingProduct: string | null;
  productForm: ProductFormType;
  onFormChange: (form: ProductFormType) => void;
  onNotify: (message: string, type: 'error' | 'success' | 'warning') => void;
  onEditClick: (value: string | null) => void;
}

export default function ProductForm({
  editingProduct,
  productForm,
  handleProductSubmit,
  onFormChange,
  onNotify,
  onToggleForm,
  onEditClick,
}: ProductFormProps) {
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
              onChange={(e) => onFormChange({ ...productForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>설명</label>
            <Input
              type='text'
              value={productForm.description}
              onChange={(e) => onFormChange({ ...productForm, description: e.target.value })}
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
                  onFormChange({
                    ...productForm,
                    price: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  onFormChange({ ...productForm, price: 0 });
                } else if (parseInt(value) < 0) {
                  onNotify('가격은 0보다 커야 합니다', 'error');
                  onFormChange({ ...productForm, price: 0 });
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
                  onFormChange({
                    ...productForm,
                    stock: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  onFormChange({ ...productForm, stock: 0 });
                } else if (parseInt(value) < 0) {
                  onNotify('재고는 0보다 커야 합니다', 'error');
                  onFormChange({ ...productForm, stock: 0 });
                } else if (parseInt(value) > 9999) {
                  onNotify('재고는 9999개를 초과할 수 없습니다', 'error');
                  onFormChange({ ...productForm, stock: 9999 });
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
                    onFormChange({ ...productForm, discounts: newDiscounts });
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
                    onFormChange({ ...productForm, discounts: newDiscounts });
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
                    onFormChange({ ...productForm, discounts: newDiscounts });
                  }}
                  icon={<DeleteIcon />}
                />
              </div>
            ))}

            <Button
              type='button'
              onClick={() => {
                onFormChange({
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
              onEditClick(null);
              onFormChange({
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
