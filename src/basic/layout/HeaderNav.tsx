import { CartIcon } from "../components/icons";
import AdminToggle from "../components/ui/AdminToggle";
import { CartItem } from "../../types";

interface HeaderNavProps {
  isAdmin: boolean;
  cart: CartItem[];
  onToggleAdmin: () => void;
  className?: string;
}

export default function HeaderNav({
  isAdmin,
  cart,
  onToggleAdmin,
  className = "",
}: HeaderNavProps) {
  // 장바구니 총 상품 수 계산
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={`flex items-center space-x-4 ${className}`}>
      <AdminToggle isAdmin={isAdmin} onToggle={onToggleAdmin} />
      {!isAdmin && (
        <CartIcon
          itemCount={totalItemCount}
          className="w-6 h-6 text-gray-700"
        />
      )}
    </nav>
  );
}
