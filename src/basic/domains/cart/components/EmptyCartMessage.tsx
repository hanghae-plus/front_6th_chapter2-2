import { ShoppingBagIcon } from "../../../shared";

export function EmptyCartMessage() {
  return (
    <div className="py-8 text-center">
      <ShoppingBagIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" strokeWidth={1} />
      <p className="text-sm text-gray-500">장바구니가 비어있습니다</p>
    </div>
  );
}
