import { useState } from "react";

import { useCoupon } from "@/advanced/features/coupon/hooks/useCoupon";
import { DiscountType } from "@/advanced/features/discount/types/discount.type";
import { throwNotificationError } from "@/advanced/features/notification/utils/notificationError.util";
import { DEFAULTS } from "@/advanced/shared/constants/defaults";
import { VALIDATION } from "@/advanced/shared/constants/validation";
import { regexUtils } from "@/advanced/shared/utils";

interface CouponFormProps {
  setShowCouponForm: (showCouponForm: boolean) => void;
}

export default function CouponForm({ setShowCouponForm }: CouponFormProps) {
  const { addCoupon } = useCoupon();

  const [couponForm, setCouponForm] = useState(DEFAULTS.COUPON_FORM);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm(DEFAULTS.COUPON_FORM);
    setShowCouponForm(false);
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  name: e.target.value,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  code: e.target.value.toUpperCase(),
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountType: e.target.value as DiscountType,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <input
              type="text"
              value={
                couponForm.discountValue === 0 ? "" : couponForm.discountValue
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || regexUtils.isNumeric(value)) {
                  setCouponForm({
                    ...couponForm,
                    discountValue:
                      value === ""
                        ? VALIDATION.COUPON_LIMITS.MIN_DISCOUNT_VALUE
                        : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (couponForm.discountType === "percentage") {
                  if (
                    value > VALIDATION.COUPON_LIMITS.MAX_DISCOUNT_PERCENTAGE
                  ) {
                    setCouponForm({
                      ...couponForm,
                      discountValue:
                        VALIDATION.COUPON_LIMITS.MAX_DISCOUNT_PERCENTAGE,
                    });

                    throwNotificationError.error(
                      `할인율은 ${VALIDATION.COUPON_LIMITS.MAX_DISCOUNT_PERCENTAGE}%를 초과할 수 없습니다`
                    );
                  } else if (
                    value < VALIDATION.COUPON_LIMITS.MIN_DISCOUNT_VALUE
                  ) {
                    setCouponForm({
                      ...couponForm,
                      discountValue:
                        VALIDATION.COUPON_LIMITS.MIN_DISCOUNT_VALUE,
                    });
                  }
                } else {
                  if (value > VALIDATION.COUPON_LIMITS.MAX_DISCOUNT_AMOUNT) {
                    setCouponForm({
                      ...couponForm,
                      discountValue:
                        VALIDATION.COUPON_LIMITS.MAX_DISCOUNT_AMOUNT,
                    });

                    throwNotificationError.error(
                      `할인율은 ${VALIDATION.COUPON_LIMITS.MAX_DISCOUNT_PERCENTAGE}%를 초과할 수 없습니다`
                    );
                  } else if (
                    value < VALIDATION.COUPON_LIMITS.MIN_DISCOUNT_VALUE
                  ) {
                    setCouponForm({
                      ...couponForm,
                      discountValue:
                        VALIDATION.COUPON_LIMITS.MIN_DISCOUNT_VALUE,
                    });
                  }
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowCouponForm(false)}
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
