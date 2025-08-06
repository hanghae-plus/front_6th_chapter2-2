import React from "react";
import { CouponCard } from "./CouponCard";
import { AddCouponButton } from "./AddCouponButton";
import { Coupon } from "../../../types";

interface CouponGridProps {
  coupons: Coupon[];
  onDeleteCoupon: (couponCode: string) => void;
  onAddCoupon: () => void;
}

export const CouponGrid: React.FC<CouponGridProps> = ({ coupons, onDeleteCoupon, onAddCoupon }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.code} coupon={coupon} onDelete={onDeleteCoupon} />
      ))}
      <AddCouponButton onClick={onAddCoupon} />
    </div>
  );
};
