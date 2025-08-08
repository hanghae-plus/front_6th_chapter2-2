import { tv } from "tailwind-variants";

const tabButton = tv({
  base: "border-b-2 px-1 py-2 text-sm font-medium transition-colors",
  variants: {
    active: {
      true: "border-gray-900 text-gray-900",
      false: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }
  }
});

type AdminTabsProps = {
  activeTab: "products" | "coupons";
  onTabChange: (tab: "products" | "coupons") => void;
};

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const handleProductsTabClick = () => {
    onTabChange("products");
  };

  const handleCouponsTabClick = () => {
    onTabChange("coupons");
  };

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={handleProductsTabClick}
          className={tabButton({ active: activeTab === "products" })}
        >
          상품 관리
        </button>
        <button
          onClick={handleCouponsTabClick}
          className={tabButton({ active: activeTab === "coupons" })}
        >
          쿠폰 관리
        </button>
      </nav>
    </div>
  );
}
