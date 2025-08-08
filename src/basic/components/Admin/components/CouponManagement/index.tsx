import React from "react";
import AdminCoupon from "./components/AdminCoupon";

type Coupon = {
  code: string;
  name: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type CouponForm = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

interface CouponManagementProps {
  coupons: Coupon[];
  deleteCoupon: (code: string) => void;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
  couponForm: CouponForm;
  setCouponForm: (form: CouponForm) => void;
  handleCouponSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  addNotification: (msg: string, type: string) => void;
}

export default function CouponManagement(props: CouponManagementProps) {
  const {
    coupons,
    deleteCoupon,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleCouponSubmit,
    addNotification,
  } = props;

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map(coupon => (
            <AdminCoupon coupon={coupon} deleteCoupon={deleteCoupon} />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">
                새 쿠폰 생성
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    쿠폰명
                  </label>
                  <input
                    type="text"
                    value={couponForm.name}
                    onChange={e =>
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
                    onChange={e =>
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
                    onChange={e =>
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
                      couponForm.discountValue === 0
                        ? ""
                        : couponForm.discountValue
                    }
                    onChange={e => {
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        setCouponForm({
                          ...couponForm,
                          discountValue: value === "" ? 0 : parseInt(value),
                        });
                      }
                    }}
                    onBlur={e => {
                      const value = parseInt(e.target.value) || 0;
                      if (couponForm.discountType === "percentage") {
                        if (value > 100) {
                          addNotification(
                            "할인율은 100%를 초과할 수 없습니다",
                            "error"
                          );
                          setCouponForm({
                            ...couponForm,
                            discountValue: 100,
                          });
                        } else if (value < 0) {
                          setCouponForm({
                            ...couponForm,
                            discountValue: 0,
                          });
                        }
                      } else {
                        if (value > 100000) {
                          addNotification(
                            "할인 금액은 100,000원을 초과할 수 없습니다",
                            "error"
                          );
                          setCouponForm({
                            ...couponForm,
                            discountValue: 100000,
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
        )}
      </div>
    </section>
  );
}
