import { useState } from "react";
import { AddNotification, Coupon } from "../../../types";
import { AddIcon, DeleteIcon } from "../icons";
import Input from "../common/Input";
import { NOTIFICATION_MESSAGE } from "../../constants";
import { couponHandler } from "../../handlers/coupon";

interface CouponsTabContentsProps {
  coupons: Array<Coupon>;
  handleDeleteCoupon: (couponCode: string) => void;
  handleAddCoupon: (newCoupon: Coupon) => void;
  addNotification: AddNotification;
}

const CouponsTabContents = ({
  coupons,
  handleDeleteCoupon,
  handleAddCoupon,
  addNotification,
}: CouponsTabContentsProps) => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const { handleCouponSubmit } = couponHandler(
    handleAddCoupon,
    couponForm,
    setCouponForm,
    setShowCouponForm
  );

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 font-mono">
                    {coupon.code}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                      {coupon.discountType === "amount"
                        ? `${coupon.discountValue.toLocaleString()}원 할인`
                        : `${coupon.discountValue}% 할인`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(coupon.code)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <AddIcon />
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
                <Input
                  labelText={"쿠폰명"}
                  type={"text"}
                  value={couponForm.name}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      name: e.target.value,
                    })
                  }
                  placeholder={"신규 가입 쿠폰"}
                  required
                />
                <Input
                  labelText={"쿠폰 코드"}
                  type={"text"}
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder={"WELCOME2024"}
                  required
                />
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
                <Input
                  labelText={
                    couponForm.discountType === "amount"
                      ? "할인 금액"
                      : "할인율(%)"
                  }
                  type={"text"}
                  value={
                    couponForm.discountValue === 0
                      ? ""
                      : couponForm.discountValue
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
                      if (value > 100) {
                        addNotification(
                          NOTIFICATION_MESSAGE.ERROR.MAX_SALE_PERCENT,
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
                          NOTIFICATION_MESSAGE.ERROR.MAX_SALE_PRICE,
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
                  placeholder={
                    couponForm.discountType === "amount" ? "5000" : "10"
                  }
                  required
                />
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
};

export default CouponsTabContents;
