import { CartItem, Coupon } from '../../types';
import { ProductWithUI } from '../entities/product';
import { ProductList } from '../features/product/shop/ui';
import { useCart } from '../features/cart/hooks';
import { useProductSearch } from '../features/product/shop/hooks';
import { ShoppingSidebar } from '../widgets/ShoppingSidebar/ui';

interface ShoppingPageProps {
  products: ProductWithUI[];
  searchTerm: string;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  calculateCartTotalWithCoupon: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

export default function ShoppingPage({
  products,
  searchTerm,
  cart,
  setCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  addNotification,
  calculateCartTotalWithCoupon,
}: ShoppingPageProps) {
  const { filteredProducts } = useProductSearch(products, searchTerm);

  const { addToCart } = useCart({
    cart,
    setCart,
    products,
    addNotification,
  });

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 섹션 */}
        <section>
          <div className='mb-6 flex justify-between items-center'>
            <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
            <div className='text-sm text-gray-600'>
              총 {products.length}개 상품
            </div>
          </div>

          <ProductList
            products={filteredProducts}
            searchTerm={searchTerm}
            cart={cart}
            onAddToCart={addToCart}
          />
        </section>
      </div>

      {/* ShoppingSidebar (widgets) */}
      <div className='lg:col-span-1'>
        <ShoppingSidebar
          cart={cart}
          setCart={setCart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          products={products}
          addNotification={addNotification}
          calculateCartTotalWithCoupon={calculateCartTotalWithCoupon}
        />
      </div>
    </div>
  );
}
