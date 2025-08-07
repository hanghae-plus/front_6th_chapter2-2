import AdminTabs from "@/advanced/features/admin/components/AdminTabs";
import Header from "@/advanced/shared/components/layout/Header";
import MainLayout from "@/advanced/shared/components/layout/MainLayout";
import PageLayout from "@/advanced/shared/components/layout/PageLayout";

interface AdminPageProps {
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function AdminPage({ setIsAdmin }: AdminPageProps) {
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

          <AdminTabs />
        </div>
      </MainLayout>
    </PageLayout>
  );
}
