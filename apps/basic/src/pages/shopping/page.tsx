import { CartSection } from './components/cart-section';
import { CouponSection } from './components/coupon-section';
import { PaymentInfoSection } from './components/payment-info-section';
import { ProductSection } from './components/product-section';
import { useShoppingPageViewModel } from './view-model';

type Props = {
  searchTerm: string;
};

const ShoppingPage = ({ searchTerm }: Props) => {
  const {
    products,
    cartItems,
    coupons,
    cartTotals,
    applyCoupon,
    selectedCoupon,
    completeOrder,
    resetSelectedCoupon,
    updateQuantity,
    addToCart,
    removeFromCart,
    formatPrice,
    filterProducts
  } = useShoppingPageViewModel();

  const filteredProducts = filterProducts(searchTerm);

  return (
    <main className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-3'>
          <ProductSection
            products={products}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            formatPrice={formatPrice}
            cart={cartItems}
            addToCart={addToCart}
          />
        </div>

        <div className='lg:col-span-1'>
          <div className='sticky top-24 space-y-4'>
            <CartSection
              cart={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />

            {cartItems.length > 0 && (
              <>
                <CouponSection
                  coupons={coupons}
                  selectedCoupon={selectedCoupon}
                  applyCoupon={applyCoupon}
                  resetSelectedCoupon={resetSelectedCoupon}
                />

                <PaymentInfoSection
                  totalAfterDiscount={cartTotals.totalAfterDiscount}
                  totalBeforeDiscount={cartTotals.totalBeforeDiscount}
                  completeOrder={completeOrder}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShoppingPage;
