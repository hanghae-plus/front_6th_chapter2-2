import { CouponFormData } from "../../../entities/coupon/useCouponForm";
import { useNotifications } from "../../../hooks/useNotifications";
import { DISCOUNT, COUPON, MESSAGES } from "../../../constants";

interface CouponFormProps {
  couponForm: CouponFormData;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onUpdateField: (field: keyof CouponFormData, value: any) => void;
}

export const CouponForm = ({
  couponForm,
  onSubmit,
  onCancel,
  onUpdateField,
}: CouponFormProps) => {
  // Hook을 직접 사용
  const { addNotification } = useNotifications();

  const handleDiscountValueChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      onUpdateField("discountValue", value === "" ? 0 : parseInt(value));
    }
  };

  const handleDiscountValueBlur = (value: string) => {
    const numValue = parseInt(value) || 0;

    if (couponForm.discountType === "percentage") {
      if (numValue > DISCOUNT.MAX_PERCENTAGE_RATE) {
        addNotification(
          MESSAGES.ERROR.DISCOUNT_RATE_MAX(DISCOUNT.MAX_PERCENTAGE_RATE),
          "error"
        );
        onUpdateField("discountValue", DISCOUNT.MAX_PERCENTAGE_RATE);
      } else if (numValue < 0) {
        onUpdateField("discountValue", 0);
      }
    } else {
      if (numValue > COUPON.MAX_DISCOUNT_AMOUNT) {
        addNotification(
          MESSAGES.ERROR.DISCOUNT_AMOUNT_MAX(COUPON.MAX_DISCOUNT_AMOUNT),
          "error"
        );
        onUpdateField("discountValue", COUPON.MAX_DISCOUNT_AMOUNT);
      } else if (numValue < 0) {
        onUpdateField("discountValue", 0);
      }
    }
  };

  const discountLabel =
    couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)";
  const discountPlaceholder =
    couponForm.discountType === "amount" ? "5000" : "10";

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
              onChange={(e) => onUpdateField("name", e.target.value)}
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
                onUpdateField("code", e.target.value.toUpperCase())
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
                  onUpdateField(
                    "discountType",
                    e.target.value as "amount" | "percentage"
                  )
                }
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              >
                <option value="amount">정액 할인</option>
                <option value="percentage">정률 할인</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {discountLabel}
              </label>
              <input
                type="text"
                value={
                  couponForm.discountValue === 0 ? "" : couponForm.discountValue
                }
                onChange={(e) => handleDiscountValueChange(e.target.value)}
                onBlur={(e) => handleDiscountValueBlur(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                placeholder={discountPlaceholder}
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
