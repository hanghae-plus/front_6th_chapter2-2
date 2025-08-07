import AdminTabs from "@/basic/features/admin/components/AdminTabs";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import Header from "@/basic/shared/components/layout/Header";
import MainLayout from "@/basic/shared/components/layout/MainLayout";
import PageLayout from "@/basic/shared/components/layout/PageLayout";

interface AdminPageProps {
  setIsAdmin: (isAdmin: boolean) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addNotification: AddNotification;
}

export default function AdminPage({
  setIsAdmin,
  selectedCoupon,
  setSelectedCoupon,
  addNotification,
}: AdminPageProps) {
  return (
    <PageLayout>
      <Header.Admin setIsAdmin={setIsAdmin} />

      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 mt-1">
              상품과 쿠폰을 관리할 수 있습니다
            </p>
          </div>

          <AdminTabs
            addNotification={addNotification}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        </div>
      </MainLayout>
    </PageLayout>
  );
}
