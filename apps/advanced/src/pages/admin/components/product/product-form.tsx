import { Discount } from '@/models/discount';
import { notificationTypeSchema } from '@/models/notification';
import { ProductView, STOCK_STATUS } from '@/models/product';
import { useNotificationService } from '@/services';
import { Button, InputField } from '@/shared/ui';
import { FormEvent } from 'react';
import { z } from 'zod';
import { DiscountPolicy } from './discount-policy';
import {
  numberInputSchema,
  priceSchema,
  stockSchema
} from './product-form.validation';

type Props = {
  productForm: Omit<ProductView, 'id'>;
  editingProduct: string | null;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  onUpdateForm: (form: Omit<ProductView, 'id'>) => void;
};

const ProductForm = ({
  productForm,
  editingProduct,
  onSubmit,
  onCancel,
  onUpdateForm
}: Props) => {
  const { addNotification } = useNotificationService();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateForm({ ...productForm, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateForm({ ...productForm, description: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      const validNumber = numberInputSchema.parse(value);
      onUpdateForm({ ...productForm, price: validNumber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        addNotification(
          error.issues[0].message,
          notificationTypeSchema.enum.error
        );
      }
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      const validPrice = priceSchema.parse(value);
      onUpdateForm({ ...productForm, price: validPrice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        addNotification(
          error.issues[0].message,
          notificationTypeSchema.enum.error
        );
        onUpdateForm({ ...productForm, price: 0 });
      }
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      const validNumber = numberInputSchema.parse(value);
      onUpdateForm({
        ...productForm,
        stock: validNumber
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        addNotification(
          error.issues[0].message,
          notificationTypeSchema.enum.error
        );
      }
    }
  };

  const handleStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      const validStock = stockSchema.parse(value);
      onUpdateForm({ ...productForm, stock: validStock });
    } catch (error) {
      if (error instanceof z.ZodError) {
        addNotification(
          error.issues[0].message,
          notificationTypeSchema.enum.error
        );
        if (parseInt(value) > STOCK_STATUS.MAX) {
          onUpdateForm({ ...productForm, stock: STOCK_STATUS.MAX });
        } else {
          onUpdateForm({ ...productForm, stock: 0 });
        }
      }
    }
  };

  const handleDiscountChange = (discounts: Discount[]) => {
    onUpdateForm({ ...productForm, discounts });
  };

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InputField
            label='상품명'
            value={productForm.name}
            onChange={handleNameChange}
            required
          />
          <InputField
            label='설명'
            value={productForm.description ?? ''}
            onChange={handleDescriptionChange}
          />
          <InputField
            label='가격'
            value={productForm.price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder='숫자만 입력'
            required
          />
          <InputField
            label='재고'
            value={productForm.stock}
            onChange={handleStockChange}
            onBlur={handleStockBlur}
            placeholder='숫자만 입력'
            required
          />
        </div>
        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            할인 정책
          </label>
          <DiscountPolicy
            discounts={productForm.discounts}
            onChange={handleDiscountChange}
          />
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'>
            취소
          </Button>
          <Button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'>
            {editingProduct === 'new' ? '추가' : '수정'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
