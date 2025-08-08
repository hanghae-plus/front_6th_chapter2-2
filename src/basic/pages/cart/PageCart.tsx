import { CartItem, Coupon } from "../../../types.ts";
import { ProductWithUI } from "../../entities/ProductWithUI.ts";
import { SectionCart } from "./SectionCart.tsx";
import { SectionProductList } from "./SectionProductList.tsx";

interface PageCartProps {
  products: ProductWithUI[];
  searchTerm: string;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

function PageCart({
  products,
  searchTerm,
  cart,
  setCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleNotificationAdd,
}: PageCartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <SectionProductList
          products={products}
          searchTerm={searchTerm}
          cart={cart}
          setCart={setCart}
          handleNotificationAdd={handleNotificationAdd}
        />
      </div>

      <SectionCart
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        cart={cart}
        products={products}
        setCart={setCart}
        handleNotificationAdd={handleNotificationAdd}
        coupons={coupons}
      />
    </div>
  );
}

export default PageCart;
