import type { NotificationFunction } from "../../../shared";
import type { Coupon } from "../types";
import { couponNotificationService } from "./couponNotificationService";
import { couponValidationService } from "./couponValidationService";

type CouponUpdater = (updater: (prev: Coupon[]) => Coupon[]) => void;

export const couponApplicationService = {
  addCoupon: (
    newCoupon: Coupon,
    existingCoupons: Coupon[],
    updateCoupons: CouponUpdater,
    addNotification: NotificationFunction
  ) => {
    const validation = couponValidationService.validateCouponCode(newCoupon.code, existingCoupons);
    if (!validation.valid) {
      couponNotificationService.showValidationError(validation.message!, addNotification);
      return;
    }

    updateCoupons((prev) => [...prev, newCoupon]);
    couponNotificationService.showAddSuccess(addNotification);
  },

  deleteCoupon: (
    couponCode: string,
    selectedCoupon: Coupon | null,
    updateCoupons: CouponUpdater,
    setSelectedCoupon: (coupon: Coupon | null) => void,
    addNotification: NotificationFunction
  ) => {
    updateCoupons((prev) => prev.filter((c) => c.code !== couponCode));

    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }

    couponNotificationService.showDeleteSuccess(addNotification);
  },

  applyCoupon: (
    coupon: Coupon,
    totalAmount: number | undefined,
    setSelectedCoupon: (coupon: Coupon | null) => void,
    addNotification: NotificationFunction
  ) => {
    if (totalAmount !== undefined) {
      const validation = couponValidationService.validateCouponUsage(coupon, totalAmount);
      if (!validation.valid) {
        couponNotificationService.showValidationError(validation.message!, addNotification);
        return;
      }
    }

    setSelectedCoupon(coupon);
    couponNotificationService.showApplySuccess(addNotification);
  },

  handleCouponSubmit: (
    couponForm: Coupon,
    existingCoupons: Coupon[],
    updateCoupons: CouponUpdater,
    resetForm: () => void,
    setShowForm: (show: boolean) => void,
    addNotification: NotificationFunction
  ) => {
    couponApplicationService.addCoupon(couponForm, existingCoupons, updateCoupons, addNotification);
    resetForm();
    setShowForm(false);
  }
};
