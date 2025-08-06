import { Dispatch, SetStateAction, useCallback } from "react";
import { Coupon, Product } from "../../../types";
import { useNotification } from "../../___features/notification/use-notification";
import { useCoupons } from "../../___features/coupon/useCoupons";
import ProductsContent from "./ProductsContent";
import CouponsContent from "./CouponsContent";
import { useTab } from "../../_shared/utility-hooks/use-tab";
import { cn } from "../../_shared/tw-utility/cn";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface AdminPageProps {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

function AdminPage({
  products,
  setProducts,
  selectedCoupon,
  setSelectedCoupon,
}: AdminPageProps) {
  const { addCoupon, removeCoupon, coupons } = useCoupons();
  const { addNotification } = useNotification();

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification({
        text: "상품이 추가되었습니다.",
        type: "success",
      });
    },
    [setProducts, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification({
        text: "상품이 수정되었습니다.",
        type: "success",
      });
    },
    [setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification({
        text: "상품이 삭제되었습니다.",
        type: "success",
      });
    },
    [setProducts, addNotification]
  );

  const adminTabs = useTab({
    tabs: [
      {
        id: "products",
        label: "상품 관리",
        content: (
          <ProductsContent
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        ),
      },
      {
        id: "coupons",
        label: "쿠폰 관리",
        content: (
          <CouponsContent
            coupons={coupons}
            addCoupon={addCoupon}
            removeCoupon={removeCoupon}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ),
      },
    ],
    initialTabId: "products",
    accessor: (tab) => tab.id,
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {adminTabs.getTabs().map((tab) => (
              <button
                key={tab.data.id}
                onClick={() => tab.activate()}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  {
                    "border-gray-900 text-gray-900": tab.active,
                    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300":
                      !tab.active,
                  }
                )}
              >
                {tab.data.label}
              </button>
            ))}
          </nav>
        </div>

        {adminTabs.getActiveTab()?.content}
      </div>
    </main>
  );
}

export default AdminPage;
