import { useNotifications } from "../../../hooks/useNotifications";
import { useCouponForm } from "../../../entities/coupon/useCouponForm";
import { useCouponHandlers } from "../../../entities/coupon/useCouponHandlers";
import { useAdminHandlers } from "../../../hooks/useAdminHandlers";
import { useProductHandlers } from "../../../entities/products/useProductHandlers";
import { DISCOUNT, COUPON, MESSAGES } from "../../../constants";

export const CouponForm = () => {
  // Hook들을 직접 사용
  const { addNotification } = useNotifications();
  const couponHandlers = useCouponHandlers({ addNotification });
  const productHandlers = useProductHandlers({ addNotification });
  const couponFormHook = useCouponForm();

  const adminHandlers = useAdminHandlers({
    addNotification,
    productActions: productHandlers.actions,
    couponActions: couponHandlers.actions,
    productForm: {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    },
    editingProduct: null,
    setEditingProduct: () => {},
    setShowProductForm: () => {},
    couponForm: couponFormHook.couponForm,
    closeCouponForm: couponFormHook.closeCouponForm,
  });

  const handleDiscountValueChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      couponFormHook.updateField(
        "discountValue",
        value === "" ? 0 : parseInt(value)
      );
    }
  };

  const handleDiscountValueBlur = (value: string) => {
    const numValue = parseInt(value) || 0;

    if (couponFormHook.couponForm.discountType === "percentage") {
      if (numValue > DISCOUNT.MAX_PERCENTAGE_RATE) {
        addNotification(
          MESSAGES.ERROR.DISCOUNT_RATE_MAX(DISCOUNT.MAX_PERCENTAGE_RATE),
          "error"
        );
        couponFormHook.updateField(
          "discountValue",
          DISCOUNT.MAX_PERCENTAGE_RATE
        );
      } else if (numValue < 0) {
        couponFormHook.updateField("discountValue", 0);
      }
    } else {
      if (numValue > COUPON.MAX_DISCOUNT_AMOUNT) {
        addNotification(
          MESSAGES.ERROR.DISCOUNT_AMOUNT_MAX(COUPON.MAX_DISCOUNT_AMOUNT),
          "error"
        );
        couponFormHook.updateField("discountValue", COUPON.MAX_DISCOUNT_AMOUNT);
      } else if (numValue < 0) {
        couponFormHook.updateField("discountValue", 0);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    adminHandlers.actions.handleCouponSubmit(e);
  };

  const handleCancel = () => {
    couponFormHook.closeCouponForm();
  };

  const discountLabel =
    couponFormHook.couponForm.discountType === "amount"
      ? "할인 금액"
      : "할인율(%)";
  const discountPlaceholder =
    couponFormHook.couponForm.discountType === "amount" ? "5000" : "10";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">새 쿠폰 추가</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponFormHook.couponForm.name}
              onChange={(e) =>
                couponFormHook.updateField("name", e.target.value)
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
              value={couponFormHook.couponForm.code}
              onChange={(e) =>
                couponFormHook.updateField("code", e.target.value.toUpperCase())
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
                value={couponFormHook.couponForm.discountType}
                onChange={(e) =>
                  couponFormHook.updateField(
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
                  couponFormHook.couponForm.discountValue === 0
                    ? ""
                    : couponFormHook.couponForm.discountValue
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
              onClick={handleCancel}
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
