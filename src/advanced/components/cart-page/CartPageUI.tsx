import React from 'react';
import type { CartItem, Product } from '../../../types';
import { CartItemInfo } from './cart/CartItem';
import { EmptyCart } from './cart/EmptyCart';
import { CartTitle } from './cart/ui/CartTitle';
import { Coupons } from './coupons/Coupons';
import { OrderSummary } from './order/OrderSummary';
import { EmptyProducts } from './products/EmptyProducts';
import { TotalCount } from './products/TotalCount';

interface CartPageUIProps {
  // 상품 목록 관련
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;

  // 장바구니 관련
  cart: CartItem[];
  cartItemsWithData: Array<{
    cartItem: CartItem;
    discountRate: number;
    itemTotal: number;
  }>;

  // 이벤트 핸들러
  onProductCardRender: (product: Product) => React.ReactNode;
}

export function CartPageUI({
  products,
  filteredProducts,
  searchTerm,
  cart,
  cartItemsWithData,
  onProductCardRender,
}: CartPageUIProps) {
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
                return onProductCardRender(product);
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
                {cartItemsWithData.map(
                  ({ cartItem, discountRate, itemTotal }) => {
                    return (
                      <CartItemInfo
                        key={cartItem.product.id}
                        cartItem={cartItem}
                        discountRate={discountRate}
                        itemTotal={itemTotal}
                      />
                    );
                  }
                )}
              </div>
            )}
          </section>

          <Coupons />

          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
