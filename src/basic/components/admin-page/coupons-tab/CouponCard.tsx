import type { Coupon } from '../../../../types';
import { formatNumberWon } from '../../../utils/formatters';
import { Card } from './ui/Card';

interface Props {
  coupon: Coupon;
  onClickDelete: (params: { couponCode: string }) => void;
}

export function CouponCard({ coupon, onClickDelete }: Props) {
  const { name, code, discountType, discountValue } = coupon;
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {discountType === 'amount'
                ? `${formatNumberWon({ price: discountValue })} 할인`
                : `${discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={() =>
            onClickDelete({
              couponCode: code,
            })
          }
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          {/* icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </Card>
  );
}
