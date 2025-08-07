import Form from '../ui/Form.tsx';
import FormField from '../ui/FormField.tsx';
import Input from '../ui/Input.tsx';
import Button from '../ui/Button.tsx';
import { CloseIcon } from '../icons';
import { ProductWithUI } from '../../models/entities';
import { FormType } from './ProductTab.tsx';
import {
  BlurHandler,
  FormSubmitHandler,
  InputChangeHandler,
} from '../../models/common';
import { NotificationHandler } from '../../models/components/toast.types.ts';

interface FormProps {
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  productForm: FormType;
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  addNotification: NotificationHandler;
  onComplete: () => void;
  editingProduct: string | null;
  handler: {
    handleFieldChange: InputChangeHandler;
    handleNumberField: InputChangeHandler;
    handleNumberFieldBlur: (fieldName: string) => BlurHandler;
    handleDiscountAdd: () => void;
    handleDiscountUpdate: (
      index: number,
      field: 'quantity' | 'rate'
    ) => InputChangeHandler;
    handleDiscountRemove: (index: number) => () => void;
    handleProductSubmit: FormSubmitHandler;
    handleAddDiscount: () => void;
  };
}
const ProductForm = ({
  productForm,
  onComplete,
  editingProduct,
  handler,
}: FormProps) => {
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <Form
        onSubmit={handler.handleProductSubmit}
        title={editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField title={'상품명'}>
            <Input
              name="name"
              type="text"
              value={productForm.name}
              onChange={handler.handleFieldChange}
              size={'lg'}
              required={true}
            />
          </FormField>
          <FormField title={'설명'}>
            <Input
              name={'description'}
              type="text"
              size={'lg'}
              value={productForm.description}
              onChange={handler.handleFieldChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </FormField>
          <FormField title={'가격'}>
            <Input
              name="price"
              type="text"
              size={'lg'}
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={handler.handleNumberField}
              onBlur={handler.handleNumberFieldBlur('price')}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </FormField>
          <FormField title={'재고'}>
            <Input
              name={'stock'}
              type="text"
              size={'lg'}
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={handler.handleNumberField}
              onBlur={handler.handleNumberFieldBlur('stock')}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </FormField>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <Input
                  name="discounts"
                  type="number"
                  value={discount.quantity}
                  onChange={handler.handleDiscountUpdate(index, 'quantity')}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <Input
                  name="discounts"
                  type="number"
                  value={discount.rate * 100}
                  onChange={handler.handleDiscountUpdate(index, 'rate')}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <Button
                  type="button"
                  onClick={handler.handleDiscountRemove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={handler.handleAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === 'new' ? '추가' : '수정'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
