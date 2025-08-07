import CartSummary from "@/advanced/features/cart/components/CartSummary";
import { useCart } from "@/advanced/features/cart/hooks/useCart";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import ProductList from "@/advanced/features/product/components/ProductList";
import { useSearch } from "@/advanced/features/search/hooks/useSearch";
import Header from "@/advanced/shared/components/layout/Header";
import MainLayout from "@/advanced/shared/components/layout/MainLayout";
import PageLayout from "@/advanced/shared/components/layout/PageLayout";

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
