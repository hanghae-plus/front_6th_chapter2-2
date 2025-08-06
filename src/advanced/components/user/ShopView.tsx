import { CartItem, Coupon, Product, ProductWithUI } from '../../../types';
import { getRemainingStock } from '../../utils/calculations/stockCalculations';
import ProductCard from '../ui/ProductCard';
import Cart from './Cart';

interface ShopViewProps {
  products: Product[];
  filteredProductList: ProductWithUI[];
  debouncedQuery: string;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  addToCart: (product: ProductWithUI) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon, cart: CartItem[]) => void;
  onSelectedCouponChange: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
}

export default function ShopView({
  products,
  filteredProductList,
  debouncedQuery,
  cart,
  coupons,
  selectedCoupon,
  totals,
  addToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onSelectedCouponChange,
  onCompleteOrder,
}: ShopViewProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <section>
          <div className='mb-6 flex justify-between items-center'>
            <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
            <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
          </div>
          {filteredProductList.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500'>"{debouncedQuery}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredProductList?.map((product) => {
                const remainingStock = getRemainingStock(product, cart);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cart={cart}
                    remainingStock={remainingStock}
                    addToCart={addToCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
      <Cart
        cart={cart}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        totals={totals}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        onApplyCoupon={onApplyCoupon}
        onSelectedCouponChange={onSelectedCouponChange}
        onCompleteOrder={onCompleteOrder}
      />
    </div>
  );
}
