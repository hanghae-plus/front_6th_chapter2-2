import Cart from "./cart/Cart";
import { ProductList } from "./cart/ProductList";

export const CartPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart />
        </div>
      </div>
    </div>
  );
};
