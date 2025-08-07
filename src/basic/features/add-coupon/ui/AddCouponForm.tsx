import { Coupon } from "@/types";
import { CouponFormFields, useCouponForm } from "@entities/coupon";
import {
  NotificationVariant,
  useGlobalNotification,
} from "@entities/notification";

interface AddCouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
}

export function AddCouponForm({ onSubmit, onCancel }: AddCouponFormProps) {
  const { addNotification } = useGlobalNotification();
  const form = useCouponForm({
    onSubmit: (couponData) => {
      const couponWithId = { ...couponData, id: Date.now().toString() };
      onSubmit(couponWithId);
    },
  });

  const handleDiscountValueBlur = (value: string) => {
    const error = form.handleDiscountValueBlur(value);
    if (error) {
      addNotification(error, NotificationVariant.ERROR);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>

        <CouponFormFields
          values={form.values}
          onChange={form.handleFieldChange}
          onDiscountValueBlur={handleDiscountValueBlur}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
}
