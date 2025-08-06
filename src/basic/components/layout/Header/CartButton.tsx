import Icon from "@/basic/components/icons/Icon";

interface CartIconProps {
  itemCount: number;
}

export function CartButton({ itemCount }: CartIconProps) {
  return (
    <div className="relative">
      <Icon.cart />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </div>
  );
}
