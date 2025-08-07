import { useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { MESSAGES } from '../constants/messages';
import { ORDER } from '../constants/business';
import ProductList from './ui/product/ProductList';
import CartList from './ui/cart/CartList';
import CouponSelector from './ui/coupon/CouponSelector';
import OrderSummary from './ui/cart/OrderSummary';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useCoupons } from '../hooks/useCoupons';
import { useNotification } from '../hooks/useNotification';
import { useSearchTerm } from '../hooks/useSearchTerm';

const ShopPage = () => {
  const { products } = useProducts();
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  } = useCart();
  const { coupons } = useCoupons();
  const { addNotification } = useNotification();
  const { debouncedSearchTerm } = useSearchTerm();

  // 장바구니 담기 버튼 처리
  const addItemToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification(MESSAGES.PRODUCT.OUT_OF_STOCK, 'error');
        return;
      }

      addToCart(product);
      addNotification(MESSAGES.PRODUCT.ADDED_TO_CART, 'success');
    },
    [addNotification, getRemainingStock, addToCart],
  );

  // 장바구니의 상품 수 업데이트 (-1, +1 처리)
  const updateItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItemFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(MESSAGES.PRODUCT.MAX_STOCK(maxStock));
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, addNotification, updateQuantity],
  );

  // 장바구니에서 상품 제거
  const removeItemFromCart = useCallback(
    (productId: string) => {
      removeFromCart(productId);
    },
    [removeFromCart],
  );

  // 쿠폰 적용 함수
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      // 할인 적용 전 총 가격
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      // 총 가격 10000원 이하일 경우 처리
      if (currentTotal < ORDER.MIN_FOR_COUPON && coupon.discountType === 'percentage') {
        addNotification(MESSAGES.COUPON.MIN_PRICE, 'error');
        return;
      }

      // 쿠폰 적용 후 알림 처리
      setSelectedCoupon(coupon);
      addNotification(MESSAGES.COUPON.APPLIED, 'success');
    },
    [addNotification, calculateCartTotal, setSelectedCoupon],
  );

  // 주문 완료 처리 함수
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(MESSAGES.ORDER.COMPLETED(orderNumber), 'success');
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  // 아이템별 총액 계산
  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  // 최대 할인율 계산
  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 */}
        <ProductList
          products={products}
          addToCart={addItemToCart}
          getRemainingStock={getRemainingStock}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      </div>

      {/* 장바구니 + 결제 정보 컨테이너 */}
      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          {/* 장바구니 */}
          <CartList
            cart={cart}
            calculateItemTotal={calculateItemTotal}
            removeItemFromCart={removeItemFromCart}
            updateItemQuantity={updateItemQuantity}
          />

          {cart.length > 0 && (
            <>
              {/* 쿠폰 선택 */}
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                applyCoupon={applyCoupon}
              />

              {/* 결제 정보 */}
              <OrderSummary cartTotalPrice={calculateCartTotal()} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
