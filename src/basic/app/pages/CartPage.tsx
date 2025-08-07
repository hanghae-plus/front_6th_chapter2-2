import type { CartItem, Coupon, Product } from "../../../types";
import { Button, CloseIcon, ImagePlaceholderIcon, ShoppingBagIcon } from "../../shared";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

type CartPageProps = {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: ProductWithUI) => void;
  cart: CartItem[];
  calculateItemTotal: (item: CartItem) => number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
  removeFromCart: (productId: string) => void;
};

export function CartPage({
  addToCart,
  applyCoupon,
  calculateItemTotal,
  cart,
  completeOrder,
  coupons,
  debouncedSearchTerm,
  filteredProducts,
  formatPrice,
  getRemainingStock,
  products,
  selectedCoupon,
  setSelectedCoupon,
  totals,
  updateQuantity,
  removeFromCart
}: CartPageProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const remainingStock = getRemainingStock(product);

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                  >
                    {/* 상품 이미지 영역 (placeholder) */}
                    <div className="relative">
                      <div className="flex aspect-square items-center justify-center bg-gray-100">
                        <ImagePlaceholderIcon className="h-24 w-24 text-gray-300" />
                      </div>

                      {product.isRecommended && (
                        <span className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                          BEST
                        </span>
                      )}
                      {product.discounts.length > 0 && (
                        <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-1 text-xs text-white">
                          ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
                        </span>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-4">
                      <h3 className="mb-1 font-medium text-gray-900">{product.name}</h3>
                      {product.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-gray-500">
                          {product.description}
                        </p>
                      )}

                      {/* 가격 정보 */}
                      <div className="mb-3">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price, product.id)}
                        </p>
                        {product.discounts.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {product.discounts[0].quantity}개 이상 구매시 할인{" "}
                            {product.discounts[0].rate * 100}%
                          </p>
                        )}
                      </div>

                      {/* 재고 상태 */}
                      <div className="mb-3">
                        {remainingStock <= 5 && remainingStock > 0 && (
                          <p className="text-xs font-medium text-red-600">
                            품절임박! {remainingStock}개 남음
                          </p>
                        )}
                        {remainingStock > 5 && (
                          <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
                        )}
                      </div>

                      {/* 장바구니 버튼 */}
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={remainingStock <= 0}
                        color={remainingStock <= 0 ? "secondary" : "dark"}
                        className="w-full"
                      >
                        {remainingStock <= 0 ? "품절" : "장바구니 담기"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <ShoppingBagIcon className="mr-2 h-5 w-5" />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBagIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" strokeWidth={1} />
                <p className="text-sm text-gray-500">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal(item);
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount
                    ? Math.round((1 - itemTotal / originalPrice) * 100)
                    : 0;

                  return (
                    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="flex-1 text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
                          >
                            <span className="text-xs">−</span>
                          </button>
                          <span className="mx-3 w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                        <div className="text-right">
                          {hasDiscount && (
                            <span className="block text-xs font-medium text-red-500">
                              -{discountRate}%
                            </span>
                          )}
                          <p className="text-sm font-medium text-gray-900">
                            {Math.round(itemTotal).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <section className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
                  <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
                </div>
                {coupons.length > 0 && (
                  <select
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={selectedCoupon?.code || ""}
                    onChange={(e) => {
                      const coupon = coupons.find((c) => c.code === e.target.value);
                      if (coupon) applyCoupon(coupon);
                      else setSelectedCoupon(null);
                    }}
                  >
                    <option value="">쿠폰 선택</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.code} value={coupon.code}>
                        {coupon.name} (
                        {coupon.discountType === "amount"
                          ? `${coupon.discountValue.toLocaleString()}원`
                          : `${coupon.discountValue}%`}
                        )
                      </option>
                    ))}
                  </select>
                )}
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-4 text-lg font-semibold">결제 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">
                      {totals.totalBeforeDiscount.toLocaleString()}원
                    </span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>
                        -{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}
                        원
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 py-2">
                    <span className="font-semibold">결제 예정 금액</span>
                    <span className="text-lg font-bold text-gray-900">
                      {totals.totalAfterDiscount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <Button onClick={completeOrder} size="lg" color="yellow" className="mt-4 w-full">
                  {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                </Button>

                <div className="mt-3 text-center text-xs text-gray-500">
                  <p>* 실제 결제는 이루어지지 않습니다</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
