// components/CouponList.tsx
import React from "react";
import { Coupon } from "../../../types";
import { formatPrice } from "../../utils/formatters";
import { Icons } from "../icons";

// props 타입 정의
interface CouponListProps {
  coupons: Coupon[];
  onRemoveCoupon: (code: string) => void;
}

export const CouponList: React.FC<CouponListProps> = ({
  coupons,
  onRemoveCoupon,
}) => (
  <div className="space-y-2">
    {coupons.map((coupon) => (
      <div
        key={coupon.code}
        className="flex justify-between items-center p-3 bg-white border rounded"
      >
        <div>
          <h5 className="font-medium">{coupon.name}</h5>
          <p className="text-sm text-gray-500">코드: {coupon.code}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-blue-600">
            {coupon.discountType === "amount"
              ? formatPrice(coupon.discountValue)
              : `${coupon.discountValue}%`}
          </span>
          <button
            onClick={() => onRemoveCoupon(coupon.code)}
            className="text-red-500 hover:text-red-700"
          >
            <Icons.Trash />
          </button>
        </div>
      </div>
    ))}
  </div>
);
