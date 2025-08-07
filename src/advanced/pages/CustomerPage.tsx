import { CartSidebar } from "../components/customer/cart/CartSidebar";
import { ProductGrid } from "../components/customer/product/ProductGrid";

export const CustomerPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductGrid />
      </div>
      <div className="lg:col-span-1">
        <CartSidebar />
      </div>
    </div>
  );
};
