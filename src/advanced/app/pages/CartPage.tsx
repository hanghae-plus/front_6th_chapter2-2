import { CartSidebar } from "../../domains/cart";
import { ProductList } from "../../domains/product";

export function CartPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <ProductList />
      </div>
      <div className="lg:col-span-1">
        <CartSidebar />
      </div>
    </div>
  );
}
