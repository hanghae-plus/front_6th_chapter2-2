import Icon from "@/basic/shared/components/icons/Icon";

interface Props {
  totalItemCount: number;
}

export function CartButton({ totalItemCount }: Props) {
  return (
    <div className="relative">
      <Icon.cart />
      {totalItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItemCount}
        </span>
      )}
    </div>
  );
}
