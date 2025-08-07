import { PlusIcon } from "../../icons";

export function AddNewCouponCard({
  setShowCouponForm,
  showCouponForm,
}: {
  setShowCouponForm: (show: boolean) => void;
  showCouponForm: boolean;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
      <button
        onClick={() => setShowCouponForm(!showCouponForm)}
        className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
      >
        <PlusIcon />
        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
      </button>
    </div>
  );
}
