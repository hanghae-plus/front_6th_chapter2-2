import { Coupon } from "../../../../types";
import { useCouponForm } from "../../../hooks/useCouponForm";
import { AddIcon } from "../../elements/Icons";
import CouponCard from "./CouponCard";
import CouponForm from "./CouponForm";

interface ICouponManagementTableProps {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

const CouponManager = ({ coupons, deleteCoupon, addCoupon }: ICouponManagementTableProps) => {
  /** 쿠폰 등록 폼 hook 사용 */
  const { showCouponForm, setShowCouponForm, couponForm, setCouponForm, clearCouponForm } = useCouponForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 쿠폰 카드 */}
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} deleteCoupon={deleteCoupon} />
          ))}

          {/* 쿠폰 추가 버튼 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button onClick={() => setShowCouponForm(!showCouponForm)} className="text-gray-400 hover:text-gray-600 flex flex-col items-center">
              <AddIcon />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {/* 쿠폰 등록 form */}
        {showCouponForm && <CouponForm addCoupon={addCoupon} clearCouponForm={clearCouponForm} setShowCouponForm={setShowCouponForm} couponForm={couponForm} setCouponForm={setCouponForm} />}
      </div>
    </section>
  );
};

export default CouponManager;
