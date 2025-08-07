import { AddIcon } from '../../icons';
import { Card } from './ui/Card';

interface Props {
  onClick: () => void;
}

export function ShowCouponFormCard({ onClick }: Props) {
  return (
    <Card variant="gradient">
      <button
        onClick={onClick}
        className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
      >
        <AddIcon />
        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
      </button>
    </Card>
  );
}
