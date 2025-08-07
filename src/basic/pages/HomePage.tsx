import CartSummary from "@/basic/features/cart/components/CartSummary";
import { useCart } from "@/basic/features/cart/hooks/useCart";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import ProductList from "@/basic/features/product/components/ProductList";
import { useSearch } from "@/basic/features/search/hooks/useSearch";
import Header from "@/basic/shared/components/layout/Header";
import MainLayout from "@/basic/shared/components/layout/MainLayout";
import PageLayout from "@/basic/shared/components/layout/PageLayout";

interface HomePageProps {
  setIsAdmin: (isAdmin: boolean) => void;
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function HomePage({
  setIsAdmin,
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: HomePageProps) {
  const { searchTerm, handleInputChange, debouncedSearchTerm } = useSearch();
  const { totalItemCount } = useCart({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  return (
    <PageLayout>
      <Header.Home
        searchTerm={searchTerm}
        handleInputChange={handleInputChange}
        totalItemCount={totalItemCount}
        setIsAdmin={setIsAdmin}
      />

      <MainLayout>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProductList
              searchTerm={debouncedSearchTerm}
              addNotification={addNotification}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
            />
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              setSelectedCoupon={setSelectedCoupon}
              addNotification={addNotification}
              selectedCoupon={selectedCoupon}
            />
          </div>
        </div>
      </MainLayout>
    </PageLayout>
  );
}
