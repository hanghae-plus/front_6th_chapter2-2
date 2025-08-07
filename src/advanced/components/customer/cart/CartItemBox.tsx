import { useAtom } from "jotai";
import { useCart } from "../../../hooks/useCart";
import { useProduct } from "../../../hooks/useProduct";
import { cartAtom } from "../../../atoms/cartAtoms";
import { CartItem } from "../../../../types";
import { calculateItemTotal } from "../../../utils/cartCalculations";
import { CloseIcon } from "../../elements/Icons";

interface CartItemProps {
  item: CartItem;
}

const CartItemBox = ({ item }: CartItemProps) => {
  /** 장바구니 상태 - Jotai 사용 */
  const [cart] = useAtom(cartAtom);

  /** 상품 데이터 - useProduct hook 사용 */
  const { products } = useProduct();

  /** 장바구니 관련 actions - useCart hook 사용 */
  const { removeFromCart, updateCartQuantity } = useCart({ products });

  /** 총 가격 계산*/
  const itemTotal = calculateItemTotal(item, cart);
  /** 원래 가격 */
  const originalPrice = item.product.price * item.quantity;
  /** 할인 여부 */
  const hasDiscount = itemTotal < originalPrice;
  /** 할인 비율 */
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500 ml-2">
          <CloseIcon />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100">
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100">
            <span className="text-xs">+</span>
          </button>
        </div>

        <div className="text-right">
          {hasDiscount && <span className="text-xs text-red-500 font-medium block">-{discountRate}%</span>}
          <p className="text-sm font-medium text-gray-900">{Math.round(itemTotal).toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
};

export default CartItemBox;
