import CartSummary from "@/basic/features/cart/components/CartSummary";
import { useCart } from "@/basic/features/cart/hooks/useCart";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import ProductList from "@/basic/features/product/components/ProductList";
import { useSearch } from "@/basic/features/search/hooks/useSearch";
import Header from "@/basic/shared/components/layout/Header";
import MainLayout from "@/basic/shared/components/layout/MainLayout";
import PageLayout from "@/basic/shared/components/layout/PageLayout";

interface HomePageProps {
  setIsAdmin: (isAdmin: boolean) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function HomePage({
  setIsAdmin,
  selectedCoupon,
  setSelectedCoupon,
}: HomePageProps) {
  const { searchTerm, handleInputChange, debouncedSearchTerm } = useSearch();
  const { totalItemCount } = useCart({
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
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
            />
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              setSelectedCoupon={setSelectedCoupon}
              selectedCoupon={selectedCoupon}
            />
          </div>
        </div>
      </MainLayout>
    </PageLayout>
  );
}
