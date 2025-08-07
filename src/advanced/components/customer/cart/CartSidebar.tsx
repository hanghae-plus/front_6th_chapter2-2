import { useAtom } from "jotai";
import { cartAtom } from "../../../atoms/cartAtoms";
import { BagIcon, EmptyCartIcon } from "../../elements/Icons";
import { CouponSection } from "../CouponSection";
import { PaymentSection } from "../PaymentSection";
import CartItemBox from "./CartItemBox";

export const CartSidebar = () => {
  /** 장바구니 상태 - Jotai 사용 */
  const [cart] = useAtom(cartAtom);

  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BagIcon />
          장바구니
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <EmptyCartIcon />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItemBox key={item.product.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponSection />
          <PaymentSection />
        </>
      )}
    </div>
  );
};
