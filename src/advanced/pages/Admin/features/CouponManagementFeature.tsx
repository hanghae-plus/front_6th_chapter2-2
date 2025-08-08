import { useAtomValue, useSetAtom } from "jotai";
import { couponsAtom, addCouponAtom, deleteCouponAtom } from "../../../stores/couponStore";
import { addNotificationAtom } from "../../../stores/notificationStore";
import { useCouponForm } from "../../../hooks/useCouponForm";
import { withTryNotifySuccess } from "../../../utils/withNotify";
import CouponManagement from "../../../components/admin/CouponManagement";
import type { NotificationType, Coupon } from "../../../types/admin";

export default function CouponManagementFeature() {
  const coupons = useAtomValue(couponsAtom);
  const addCouponSet = useSetAtom(addCouponAtom);
  const deleteCouponSet = useSetAtom(deleteCouponAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);

  const { couponForm, showCouponForm, updateField, showForm, hideForm, handleCouponSubmit } = useCouponForm();

  const handleDeleteCoupon = withTryNotifySuccess(
    (couponCode: string) => deleteCouponSet(couponCode),
    "쿠폰이 삭제되었습니다.",
    (message: string, type: NotificationType) => addNotificationSet({ message, type })
  );

  const handleAddCoupon = withTryNotifySuccess(
    (coupon: Coupon) => addCouponSet(coupon),
    "쿠폰이 추가되었습니다.",
    (message: string, type: NotificationType) => addNotificationSet({ message, type })
  );

  const handleCouponFormSubmit = (e: React.FormEvent) => {
    handleCouponSubmit(e, handleAddCoupon);
  };

  return (
    <CouponManagement
      coupons={coupons}
      onDeleteCoupon={handleDeleteCoupon}
      showCouponForm={showCouponForm}
      showForm={showForm}
      hideForm={hideForm}
      couponForm={couponForm}
      updateField={updateField}
      onCouponSubmit={handleCouponFormSubmit}
      addNotification={(message: string, type: NotificationType) => addNotificationSet({ message, type })}
    />
  );
}
