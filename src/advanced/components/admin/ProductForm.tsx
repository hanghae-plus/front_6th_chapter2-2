import { useState } from 'react';

import { ProductForm as ProductFormType } from '../../../types';
import { defaultProductForm } from '../../constants';
import { isValidPrice, isValidStock } from '../../utils/validators';
import { CloseIcon } from '../icons';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ProductFormProps {
  editingProduct: string | null;
  productForm: ProductFormType;
  setProductForm: (form: ProductFormType) => void;
  setShowProductForm: (show: boolean) => void;
  setEditingProduct: (id: string | null) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  addNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const ProductForm = ({
  editingProduct,
  productForm,
  setProductForm,
  setShowProductForm,
  setEditingProduct,
  handleProductSubmit,
  addNotification,
}: ProductFormProps) => {
  // showProductForm을 내부에서 관리
  const [showProductForm, setShowProductFormInternal] = useState(false);

  // 부모의 setShowProductForm과 동기화
  const handleSetShowProductForm = (show: boolean) => {
    setShowProductFormInternal(show);
    setShowProductForm(show);
  };

  // 부모의 버튼 클릭을 감지하여 폼을 표시
  if (editingProduct && !showProductForm) {
    setShowProductFormInternal(true);
  }

  if (!showProductForm) return null;

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form onSubmit={handleProductSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <Input
              label='상품명'
              type='text'
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              label='설명'
              type='text'
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            />
          </div>
          <div>
            <Input
              label='가격'
              type='text'
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={(e) => {
                const { value } = e.target;
                // 숫자만 허용
                if (value === '' || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    price: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const { value } = e.target;
                if (value === '') {
                  setProductForm({ ...productForm, price: 0 });
                } else if (!isValidPrice(parseInt(value))) {
                  addNotification('가격은 0보다 커야 합니다', 'error');
                  setProductForm({ ...productForm, price: 0 });
                }
              }}
              placeholder='숫자만 입력'
              required
            />
          </div>
          <div>
            <Input
              label='재고'
              type='text'
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={(e) => {
                const { value } = e.target;
                if (value === '' || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    stock: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const { value } = e.target;
                if (value === '') {
                  setProductForm({ ...productForm, stock: 0 });
                } else if (!isValidStock(parseInt(value))) {
                  if (parseInt(value) < 0) {
                    addNotification('재고는 0보다 커야 합니다', 'error');
                    setProductForm({ ...productForm, stock: 0 });
                  } else {
                    addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
                    setProductForm({ ...productForm, stock: 9999 });
                  }
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
                <Button
                  type='button'
                  onClick={() => {
                    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                    setProductForm({ ...productForm, discounts: newDiscounts });
                  }}
                  className='text-red-600 hover:text-red-800'
                >
                  <CloseIcon />
                </Button>
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
              hasTextSm
              className='text-indigo-600 hover:text-indigo-800'
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
              setProductForm(defaultProductForm);
              handleSetShowProductForm(false);
            }}
            hasTextSm
            hasFontMedium
            hasRounded
            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
          >
            취소
          </Button>
          <Button
            type='submit'
            hasTextSm
            hasFontMedium
            hasRounded
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
          >
            {editingProduct === 'new' ? '추가' : '수정'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
