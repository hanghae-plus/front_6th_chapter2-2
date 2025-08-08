import { Coupon } from "@entities/coupon";
import { CouponFormFields, useCouponForm } from "@entities/coupon";
import { useGlobalNotification } from "@entities/notification";
import { Button } from "@shared";

interface AddCouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
}

export function AddCouponForm({ onSubmit, onCancel }: AddCouponFormProps) {
  const { showErrorNotification } = useGlobalNotification();
  const form = useCouponForm({
    onSubmit: (couponData) => {
      const couponWithId = { ...couponData, id: Date.now().toString() };
      onSubmit(couponWithId);
    },
  });

  const handleDiscountValueBlur = (value: string) => {
    const error = form.handleDiscountValueBlur(value);
    if (error) {
      showErrorNotification(error);
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
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
