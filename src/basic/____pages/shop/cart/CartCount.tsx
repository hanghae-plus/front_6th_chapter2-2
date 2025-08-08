import CartIcon from "./CartIcon";

interface Props {
  count: number;
}

function CartCount({ count }: Props) {
  return (
    <div className="relative">
      <CartIcon />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}

export default CartCount;
