import { Dispatch, SetStateAction, use } from "react";
import { Coupon } from "../../../types";
import { useCoupons } from "../../___features/coupon/use-coupons";
import ProductsContent from "./ProductsContent";
import CouponsContent from "./CouponsContent";
import { useTab } from "../../_shared/utility-hooks/use-tab";
import { cn } from "../../_shared/tw-utility/cn";
import { AdminContext } from "../admin-context";

interface AdminPageProps {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

function AdminPage({ selectedCoupon, setSelectedCoupon }: AdminPageProps) {
  const { addCoupon, removeCoupon, coupons } = useCoupons();
  const { setIsAdmin } = use(AdminContext);

  const adminTabs = useTab({
    tabs: [
      {
        id: "products",
        label: "상품 관리",
        content: <ProductsContent />,
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(false)}
                className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white"
              >
                쇼핑몰로 돌아가기
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 mt-1">
              상품과 쿠폰을 관리할 수 있습니다
            </p>
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
    </div>
  );
}

export default AdminPage;
