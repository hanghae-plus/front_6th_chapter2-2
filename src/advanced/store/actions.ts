import { atom } from 'jotai';
import { ProductWithUI, Coupon, CartItem, Notification } from '../../types';
import { 
  cartAtom, 
  selectedCouponAtom, 
  notificationsAtom, 
  productsAtom, 
  couponsAtom,
  cartTotalAtom 
} from './atoms';
import { calculateItemTotal, getRemainingStock } from '../models/cart';
import { validateCouponCode } from '../models/coupon';

// 알림 액션
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type }: { message: string; type: 'success' | 'error' | 'warning' }) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };
    
    set(notificationsAtom, (prev) => [...prev, newNotification]);
    
    // 3초 후 자동 제거
    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
  }
);

// 장바구니 액션 (기존 useCart 로직)
export const addToCartAtom = atom(
  null,
  (get, set, { product, onNotification }: { product: ProductWithUI; onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void }) => {
    const cart = get(cartAtom);
    const remainingStock = getRemainingStock(product, cart);
    
    if (remainingStock <= 0) {
      onNotification?.('재고가 부족합니다!', 'error');
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;

      if (newQuantity > product.stock) {
        onNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      set(cartAtom, cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      set(cartAtom, [...cart, { product, quantity: 1 }]);
    }

    onNotification?.('장바구니에 담았습니다', 'success');
  }
);

export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    set(cartAtom, cart.filter((item) => item.product.id !== productId));
  }
);

export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, newQuantity, onNotification }: { 
    productId: string; 
    newQuantity: number; 
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  }) => {
    if (newQuantity <= 0) {
      const cart = get(cartAtom);
      set(cartAtom, cart.filter((item) => item.product.id !== productId));
      return;
    }

    const products = get(productsAtom);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      onNotification?.(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    const cart = get(cartAtom);
    set(cartAtom, cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  }
);

export const applyCouponAtom = atom(
  null,
  (get, set, { coupon, onNotification }: { coupon: Coupon; onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void }) => {
    const cartTotal = get(cartTotalAtom);
    const { totalAfterDiscount } = cartTotal;

    if (coupon.discountType === 'percentage' && totalAfterDiscount < 10000) {
      onNotification?.('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    set(selectedCouponAtom, coupon);
    onNotification?.('쿠폰이 적용되었습니다.', 'success');
  }
);

export const completeOrderAtom = atom(
  null,
  (get, set, onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void) => {
    const orderNumber = `ORD-${Date.now()}`;
    onNotification?.(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    set(cartAtom, []);
    set(selectedCouponAtom, null);
  }
);

export const clearCartAtom = atom(
  null,
  (get, set) => {
    set(cartAtom, []);
    set(selectedCouponAtom, null);
  }
);

// 상품 관리 액션 (기존 useProducts 로직)
export const addProductAtom = atom(
  null,
  (get, set, { newProduct, onNotification }: { 
    newProduct: Omit<ProductWithUI, 'id'>; 
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  }) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    set(productsAtom, (prev) => [...prev, product]);
    onNotification?.('상품이 추가되었습니다.', 'success');
  }
);

export const updateProductAtom = atom(
  null,
  (get, set, { productId, updates, onNotification }: { 
    productId: string; 
    updates: Partial<ProductWithUI>; 
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  }) => {
    set(productsAtom, (prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
    onNotification?.('상품이 수정되었습니다.', 'success');
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, { productId, onNotification }: { 
    productId: string; 
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  }) => {
    set(productsAtom, (prev) => prev.filter((p) => p.id !== productId));
    onNotification?.('상품이 삭제되었습니다.', 'success');
  }
);

// 쿠폰 관리 액션 (기존 useCoupons 로직)
export const addCouponAtom = atom(
  null,
  (get, set, { newCoupon, onNotification }: { 
    newCoupon: Coupon; 
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  }) => {
    const coupons = get(couponsAtom);
    if (!validateCouponCode(newCoupon.code, coupons)) {
      onNotification?.('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    set(couponsAtom, (prev) => [...prev, newCoupon]);
    onNotification?.('쿠폰이 추가되었습니다.', 'success');
  }
);

export const removeCouponAtom = atom(
  null,
  (get, set, { couponCode, onNotification }: { 
    couponCode: string; 
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  }) => {
    set(couponsAtom, (prev) => prev.filter((c) => c.code !== couponCode));
    onNotification?.('쿠폰이 삭제되었습니다.', 'success');
  }
);
