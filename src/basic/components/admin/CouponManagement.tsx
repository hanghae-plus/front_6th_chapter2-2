import CouponForm from './CouponForm';
import CouponList from './CouponList';
import { Coupon } from '../../../types';

type CouponFormData = {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
};

type CouponManagementProps = {
  coupons: Coupon[];
  showCouponForm: boolean;
  couponForm: CouponFormData;
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormData>>;
  onAddCoupon: () => void;
  onDeleteCoupon: (couponCode: string) => void;
  onSubmitCoupon: (e: React.FormEvent) => void;
  onCancelCoupon: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
};

export default function CouponManagement({
  coupons,
  showCouponForm,
  couponForm,
  setCouponForm,
  onAddCoupon,
  onDeleteCoupon,
  onSubmitCoupon,
  onCancelCoupon,
  addNotification,
}: CouponManagementProps) {
  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <CouponList coupons={coupons} onDeleteCoupon={onDeleteCoupon} onAddCoupon={onAddCoupon} />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            onSubmit={onSubmitCoupon}
            onCancel={onCancelCoupon}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
}
