import { CartIcon } from "../icons";

const EmptyCart = () => {
  return (
    <div className="text-center py-8">
      <CartIcon type={"empty"} strokeWidth={1} />
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  );
};

export default EmptyCart;
