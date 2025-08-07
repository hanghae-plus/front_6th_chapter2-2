import { ShoppingBagIcon } from "../icons";

interface CartHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function CartHeader({
  children,
  className = "",
}: CartHeaderProps) {
  return (
    <section
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingBagIcon className="w-5 h-5 mr-2" size="small" />
        장바구니
      </h2>
      {children}
    </section>
  );
}
