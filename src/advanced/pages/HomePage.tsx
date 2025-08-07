import CartSummary from "@/advanced/features/cart/components/CartSummary";
import { useCart } from "@/advanced/features/cart/hooks/useCart";
import ProductList from "@/advanced/features/product/components/ProductList";
import { useSearch } from "@/advanced/features/search/hooks/useSearch";
import Header from "@/advanced/shared/components/layout/Header";
import MainLayout from "@/advanced/shared/components/layout/MainLayout";
import PageLayout from "@/advanced/shared/components/layout/PageLayout";

interface HomePageProps {
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function HomePage({ setIsAdmin }: HomePageProps) {
  const { searchTerm, handleInputChange, debouncedSearchTerm } = useSearch();
  const { totalItemCount } = useCart();

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
            <ProductList searchTerm={debouncedSearchTerm} />
          </div>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </MainLayout>
    </PageLayout>
  );
}
