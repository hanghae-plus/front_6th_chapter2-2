import { useState } from "react";
import { useNotificationActions } from "../../hooks/useNotification";
import { useCouponActions } from "../../hooks/useCoupon";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import { isNumericInput } from "../../utils/validators";

interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

interface CouponFormProps {
  handleCancelCoupon: () => void;
}

const MAX_DISCOUNT_RATE = 100;
const MAX_DISCOUNT_VALUE = 100000;

export const CouponForm = ({ handleCancelCoupon }: CouponFormProps) => {
  const [couponForm, setCouponForm] = useState<CouponFormData>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });
  const { addCoupon } = useCouponActions();
  const { addNotification } = useNotificationActions();

  const handleChangeCouponForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "discountValue") {
      if (isNumericInput(value)) {
        setCouponForm({
          ...couponForm,
          [name]: value === "" ? 0 : parseInt(value),
        });
      }
    } else {
      setCouponForm({
        ...couponForm,
        [name]: value,
      });
    }
  };

  const handleBlurCouponForm = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;

    if (couponForm.discountType === "percentage") {
      if (value > MAX_DISCOUNT_RATE) {
        addNotification("할인율은 100%를 초과할 수 없습니다", "error");
        setCouponForm({
          ...couponForm,
          discountValue: MAX_DISCOUNT_RATE,
        });
        return;
      }
    }

    if (couponForm.discountType === "amount") {
      if (value > MAX_DISCOUNT_VALUE) {
        addNotification("할인 금액은 100,000원을 초과할 수 없습니다", "error");
        setCouponForm({
          ...couponForm,
          discountValue: MAX_DISCOUNT_VALUE,
        });
        return;
      }
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    handleCancelCoupon();
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input>
            <Input.Label>쿠폰명</Input.Label>
            <Input.Field
              type="text"
              name="name"
              value={couponForm.name}
              onChange={handleChangeCouponForm}
              placeholder="신규 가입 쿠폰"
              required
            />
          </Input>
          <Input>
            <Input.Label>쿠폰 코드</Input.Label>
            <Input.Field
              type="text"
              name="code"
              value={couponForm.code}
              onChange={handleChangeCouponForm}
              placeholder="WELCOME2024"
              required
            />
          </Input>
          <Input>
            <Label>할인 타입</Label>
            <Select
              value={couponForm.discountType}
              name="discountType"
              onChange={handleChangeCouponForm}
            >
              <Select.Option value="amount">정액 할인</Select.Option>
              <Select.Option value="percentage">정률 할인</Select.Option>
            </Select>
          </Input>
          <Input>
            <Input.Label>
              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </Input.Label>
            <Input.Field
              type="text"
              name="discountValue"
              value={
                couponForm.discountValue === 0 ? "" : couponForm.discountValue
              }
              onChange={handleChangeCouponForm}
              onBlur={handleBlurCouponForm}
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </Input>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelCoupon}
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
};
