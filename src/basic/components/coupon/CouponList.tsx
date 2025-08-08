import { useCouponList } from '../../hooks/admin';
import { Coupon } from '../../../types';
import { Button } from '../../../shared/components';
import { commaizedNumberWithUnit } from '../../../shared/utils/commaizedNumber';
import { CouponForm } from './CouponForm';

interface CouponListProps {
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  onAddNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
  addCoupon: (coupon: Coupon) => void;
}

export function CouponList({
  coupons,
  onDeleteCoupon,
  onAddNotification,
  addCoupon,
}: CouponListProps) {
  const {
    showCouponForm,
    couponForm,
    handleCouponSubmit,
    handleCouponFormChange,
    validateCouponForm,
    resetCouponForm,
    toggleCouponForm,
  } = useCouponList({ addCoupon });

  const handleFormSubmit = (e: React.FormEvent) => {
    const result = handleCouponSubmit(e);
    if (result.success) {
      resetCouponForm();
    }
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponGrid
          coupons={coupons}
          onDeleteCoupon={onDeleteCoupon}
          onAddNotification={onAddNotification}
          onToggleForm={toggleCouponForm}
        />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onFormChange={handleCouponFormChange}
            onFormSubmit={handleFormSubmit}
            onFormReset={resetCouponForm}
            onFormValidate={validateCouponForm}
            onAddNotification={onAddNotification}
          />
        )}
      </div>
    </section>
  );
}

interface CouponGridProps {
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  onAddNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
  onToggleForm: () => void;
}

function CouponGrid({ coupons, onDeleteCoupon, onAddNotification, onToggleForm }: CouponGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponCard
          key={coupon.code}
          coupon={coupon}
          onDelete={onDeleteCoupon}
          onAddNotification={onAddNotification}
        />
      ))}
      <AddCouponButton onClick={onToggleForm} />
    </div>
  );
}

interface CouponCardProps {
  coupon: Coupon;
  onDelete: (couponCode: string) => void;
  onAddNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
}

function CouponCard({ coupon, onDelete, onAddNotification }: CouponCardProps) {
  const handleDelete = () => {
    onDelete(coupon.code);
    onAddNotification('쿠폰이 삭제되었습니다.', 'success');
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === 'amount'
                ? `${commaizedNumberWithUnit(coupon.discountValue, '원')} 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <Button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}

interface AddCouponButtonProps {
  onClick: () => void;
}

function AddCouponButton({ onClick }: AddCouponButtonProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
      <Button onClick={onClick} variant="secondary">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
      </Button>
    </div>
  );
}
