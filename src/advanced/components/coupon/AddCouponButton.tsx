import { Button } from "../ui/button/Button";

interface AddCouponButtonProps {
  onClick: () => void;
}

export const AddCouponButton = ({ onClick }: AddCouponButtonProps) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
      <Button variant="ghost" onClick={onClick} className="flex flex-col items-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
      </Button>
    </div>
  );
};
