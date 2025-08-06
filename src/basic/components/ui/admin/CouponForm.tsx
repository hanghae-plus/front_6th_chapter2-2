import { CouponFormData } from "../../../entities/coupon/useCouponForm";
import { DISCOUNT, COUPON } from "../../../constants";

interface CouponFormProps {
  couponForm: CouponFormData;
  setCouponForm: (form: CouponFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const CouponForm = ({
  couponForm,
  setCouponForm,
  onSubmit,
  onCancel,
  addNotification,
}: CouponFormProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">새 쿠폰 추가</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) =>
                setCouponForm({ ...couponForm, name: e.target.value })
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                할인 타입
              </label>
              <select
                value={couponForm.discountType}
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    discountType: e.target.value as "amount" | "percentage",
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
                {couponForm.discountType === "amount"
                  ? "할인 금액"
                  : "할인율(%)"}
              </label>
              <input
                type="text"
                value={
                  couponForm.discountValue === 0 ? "" : couponForm.discountValue
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setCouponForm({
                      ...couponForm,
                      discountValue: value === "" ? 0 : parseInt(value),
                    });
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (couponForm.discountType === "percentage") {
                    if (value > DISCOUNT.MAX_PERCENTAGE_RATE) {
                      addNotification(
                        `할인율은 ${DISCOUNT.MAX_PERCENTAGE_RATE}%를 초과할 수 없습니다`,
                        "error"
                      );
                      setCouponForm({
                        ...couponForm,
                        discountValue: DISCOUNT.MAX_PERCENTAGE_RATE,
                      });
                    } else if (value < 0) {
                      setCouponForm({
                        ...couponForm,
                        discountValue: 0,
                      });
                    }
                  } else {
                    if (value > COUPON.MAX_DISCOUNT_AMOUNT) {
                      addNotification(
                        `할인 금액은 ${COUPON.MAX_DISCOUNT_AMOUNT.toLocaleString()}원을 초과할 수 없습니다`,
                        "error"
                      );
                      setCouponForm({
                        ...couponForm,
                        discountValue: COUPON.MAX_DISCOUNT_AMOUNT,
                      });
                    } else if (value < 0) {
                      setCouponForm({
                        ...couponForm,
                        discountValue: 0,
                      });
                    }
                  }
                }}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                placeholder={
                  couponForm.discountType === "amount" ? "5000" : "10"
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
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
    </div>
  );
};
