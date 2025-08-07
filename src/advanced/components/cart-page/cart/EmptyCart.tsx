import { EmptyCartIcon } from '../../icons';

export function EmptyCart() {
  return (
    <div className="text-center py-8">
      <EmptyCartIcon />
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  );
}
