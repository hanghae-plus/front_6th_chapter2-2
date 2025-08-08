// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시
// - Cart: 장바구니 표시 및 결제

import type { CartItem, Coupon, Product, ProductWithUI } from '../../../types';
import * as cartModel from '../../models/cart';
import * as productModel from '../../models/product';
import { CartItemInfo } from './cart/CartItem';
import { EmptyCart } from './cart/EmptyCart';
import { CartTitle } from './cart/ui/CartTitle';
import { Coupons } from './coupons/Coupons';
import { OrderSummary } from './order/OrderSummary';
import { EmptyProducts } from './products/EmptyProducts';
import { ProductCard } from './products/ProductCard';
import { TotalCount } from './products/TotalCount';

interface Props {
  searchTerm: string;
  products: ProductWithUI[];
  cart: CartItem[];
  addToCart: (params: { product: ProductWithUI }) => void;
  removeFromCart: (params: { productId: string }) => void;
  updateQuantity: (params: {
    productId: string;
    newQuantity: number;
    products: Product[];
  }) => void;

  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (params: { cart: CartItem[]; coupon: Coupon }) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
}

export function CartPage({
  searchTerm,
  products,
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
}: Props) {
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
                  <ProductCard
                    key={product.id}
                    cart={cart}
                    addToCart={addToCart}
                    product={product}
                  />
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
                  const {
                    product: { id },
                  } = item;
                  const itemTotal = cartModel.calculateItemTotal({
                    item,
                    cart,
                  });
                  const discountRate = cartModel.calculateItemDiscountRate({
                    item,
                    cart,
                  });

                  return (
                    <CartItemInfo
                      key={id}
                      cartItem={item}
                      products={products}
                      discountRate={discountRate}
                      itemTotal={itemTotal}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <Coupons
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                clearSelectedCoupon={clearSelectedCoupon}
              />

              <OrderSummary
                cart={cart}
                selectedCoupon={selectedCoupon}
                completeOrder={completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
