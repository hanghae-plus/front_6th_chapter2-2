import { useCart, useDebouncedSearch, useProducts } from '../../hooks';
import * as cartModel from '../../models/cart';
import * as productModel from '../../models/product';
import { CartItemInfo } from './cart/CartItem';
import { EmptyCart } from './cart/EmptyCart';
import { CartTitle } from './cart/ui/CartTitle';
import { Coupons } from './coupons/Coupons';
import { OrderSummary } from './order/OrderSummary';
import { EmptyProducts } from './products/EmptyProducts';
import { ProductCardContainer } from './products/ProductCardContainer';
import { TotalCount } from './products/TotalCount';

export function CartPage() {
  const cart = useCart();
  const products = useProducts();
  const searchTerm = useDebouncedSearch();

  const filteredProducts = productModel.searchProducts({
    products,
    searchTerm,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <TotalCount productsCount={products.length} />
          {filteredProducts.length === 0 ? (
            <EmptyProducts searchTerm={searchTerm} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                return (
                  <ProductCardContainer key={product.id} product={product} />
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <CartTitle>장바구니</CartTitle>

            {cart.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const { product } = item;
                  const discountRate = cartModel.calculateItemDiscountRate({
                    item,
                    cart,
                  });

                  const itemTotal = cartModel.calculateItemTotal({
                    item,
                    cart,
                  });

                  return (
                    <CartItemInfo
                      key={product.id}
                      cartItem={item}
                      discountRate={discountRate}
                      itemTotal={itemTotal}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <Coupons />
              <OrderSummary />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
