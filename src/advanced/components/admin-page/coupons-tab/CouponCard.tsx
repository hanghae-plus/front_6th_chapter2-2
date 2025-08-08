import type { Coupon } from '../../../../types';
import { formatNumberWon } from '../../../utils/formatters';
import { DeleteIcon } from '../../icons';
import { Badge } from '../../ui/Badge';
import { Card } from './ui/Card';

interface Props {
  coupon: Coupon;
  onClickDelete: (params: { couponCode: string }) => void;
}

export function CouponCard({ coupon, onClickDelete }: Props) {
  const { name, code, discountType, discountValue } = coupon;
  return (
    <Card variant="gradient">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{code}</p>
          <div className="mt-2">
            <Badge variant="discount">
              {discountType === 'amount'
                ? `${formatNumberWon({ number: discountValue })} 할인`
                : `${discountValue}% 할인`}
            </Badge>
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
          <DeleteIcon />
        </button>
      </div>
    </Card>
  );
}
