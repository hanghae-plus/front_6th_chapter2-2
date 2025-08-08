import { Card } from './ui/Card';

interface Props {
  onClick: () => void;
}

export function ShowCouponFormCard({ onClick }: Props) {
  return (
    <Card>
      <button
        onClick={onClick}
        className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
      >
        {/* icon */}
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
    </Card>
  );
}
