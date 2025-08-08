import { PlusIcon } from "../../../shared";

type AddCouponCardProps = {
  onClick: () => void;
};

export function AddCouponCard({ onClick }: AddCouponCardProps) {
  return (
    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400">
      <button
        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
        onClick={onClick}
      >
        <PlusIcon />
        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
      </button>
    </div>
  );
}
