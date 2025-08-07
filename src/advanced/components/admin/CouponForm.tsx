import { useAtom } from 'jotai';

import { CouponForm as CouponFormType } from '../../../types';
import {
  validateCouponDiscountValue,
  getCouponDiscountLabel,
  getCouponDiscountPlaceholder,
} from '../../models/coupon';
import { addNotificationAtom } from '../../store/actions';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Selector';

interface CouponFormProps {
  couponForm: CouponFormType;
  setCouponForm: (form: CouponFormType) => void;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
}

const CouponForm = ({
  couponForm,
  setCouponForm,
  showCouponForm,
  setShowCouponForm,
  handleCouponSubmit,
}: CouponFormProps) => {
  const [, addNotification] = useAtom(addNotificationAtom);

  if (!showCouponForm) return null;

  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={handleCouponSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <Input
              label='쿠폰명'
              type='text'
              value={couponForm.name}
              onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
              className='text-sm'
              placeholder='신규 가입 쿠폰'
              required
            />
          </div>
          <div>
            <Input
              label='쿠폰 코드'
              type='text'
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
              className='text-sm font-mono'
              placeholder='WELCOME2024'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>할인 타입</label>
            <Select
              focusStyle='indigo'
              className='shadow-sm'
              value={couponForm.discountType}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
            >
              <option value='amount'>정액 할인</option>
              <option value='percentage'>정률 할인</option>
            </Select>
          </div>
          <div>
            <Input
              label={getCouponDiscountLabel(couponForm.discountType)}
              type='text'
              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
              onChange={(e) => {
                const { value } = e.target;
                if (value === '' || /^\d+$/.test(value)) {
                  setCouponForm({
                    ...couponForm,
                    discountValue: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                const validation = validateCouponDiscountValue(couponForm.discountType, value);

                if (!validation.isValid) {
                  if (validation.errorMessage) {
                    addNotification({ message: validation.errorMessage, type: 'error' });
                  }
                  setCouponForm({
                    ...couponForm,
                    discountValue: validation.correctedValue || 0,
                  });
                }
              }}
              className='text-sm'
              placeholder={getCouponDiscountPlaceholder(couponForm.discountType)}
              required
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            onClick={() => setShowCouponForm(false)}
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
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
