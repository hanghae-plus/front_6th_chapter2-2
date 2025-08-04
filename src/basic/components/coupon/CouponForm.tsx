// components/CouponForm.tsx
import React, { useState } from "react";
import { Coupon } from "../../../types";
import { isValidCouponCode, isValidPrice } from "../../utils/validators";

// props 타입 정의
interface CouponFormProps {
  onAddCoupon: (coupon: Coupon) => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({ onAddCoupon }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] =
    useState<Coupon["discountType"]>("amount");
  const [discountValue, setDiscountValue] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !isValidCouponCode(code) || !isValidPrice(discountValue)) {
      alert("쿠폰 정보를 올바르게 입력해주세요. (코드: 4-12자, 대문자+숫자)");
      return;
    }
    onAddCoupon({
      name,
      code,
      discountType,
      discountValue,
    });
    setName("");
    setCode("");
    setDiscountValue(0);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
      <h4 className="text-lg font-bold mb-4">쿠폰 생성</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="쿠폰명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="쿠폰 코드 (4-12자, 대문자/숫자)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={discountType}
          onChange={(e) =>
            setDiscountType(e.target.value as Coupon["discountType"])
          }
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액 할인</option>
          <option value="percentage">퍼센트 할인</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={discountValue}
          onChange={(e) => setDiscountValue(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          쿠폰 생성
        </button>
      </div>
    </form>
  );
};
