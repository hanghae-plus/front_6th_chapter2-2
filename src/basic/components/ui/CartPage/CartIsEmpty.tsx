import { ShoppingBagIcon } from "../../icons";

export function CartIsEmpty() {
  return (
    <div className="text-center py-8">
      <ShoppingBagIcon
        className="w-16 h-16 text-gray-300 mx-auto mb-4"
        strokeWidth={1}
      />
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  );
}
