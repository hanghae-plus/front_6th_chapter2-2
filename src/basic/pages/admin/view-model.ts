import {
  calculateItemDiscounts,
  calculateSubtotal,
  getRemainingStock,
} from '@/basic/models/cart';
import {
  calculateCouponDiscount,
  Coupon,
  isValidPercentageCoupon,
} from '@/basic/models/coupon';
import { notificationTypeSchema } from '@/basic/models/notification';
import { ProductView } from '@/basic/models/product';
import { useNotificationService } from '@/basic/services/use-notification-service';
import { useCartStore, useCouponStore, useProductStore } from '@/basic/store';
import { useCallback, useState } from 'react';

export const useAdminViewModel = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Nullable<Coupon>>(null);

  const { notifications, addNotification, removeNotification } =
    useNotificationService();

  const productStore = useProductStore();
  const couponStore = useCouponStore();
  const cartStore = useCartStore();

  const generateOrderNumber = () => `ORD-${Date.now()}`;

  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    // 1단계: 기본 금액 계산
    const subtotal = calculateSubtotal(cartStore.cart);

    // 2단계: 아이템 할인 계산
    const itemDiscounts = calculateItemDiscounts(cartStore.cart);
    const totalAfterItemDiscounts = subtotal - itemDiscounts;

    // 3단계: 쿠폰 할인 계산
    const couponDiscount = calculateCouponDiscount(
      totalAfterItemDiscounts,
      selectedCoupon
    );

    // 4단계: 최종 금액 계산
    const finalTotal = Math.max(0, totalAfterItemDiscounts - couponDiscount);

    return {
      totalBeforeDiscount: Math.round(subtotal),
      totalAfterDiscount: Math.round(finalTotal),
    };
  };

  const { totalAfterDiscount } = calculateCartTotal();

  const validateCoupon = (coupon: Coupon) => {
    if (totalAfterDiscount < 10000 && isValidPercentageCoupon(coupon)) {
      throw new Error(
        'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.'
      );
    }
  };

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      try {
        validateCoupon(coupon);
        setSelectedCoupon(coupon);
        addNotification('쿠폰이 적용되었습니다.');
      } catch (error) {
        if (error instanceof Error) {
          addNotification(error.message, notificationTypeSchema.enum.error);
        }
        return;
      }
    },
    [addNotification, calculateCartTotal]
  );

  const completeOrder = useCallback(() => {
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${generateOrderNumber()}`
    );
    cartStore.clearCart();
    setSelectedCoupon(null);
  }, [addNotification]);

  const resetSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  // CART ACTIONS
  const validateCartItemQuantity = (product: ProductView) => {
    const remainingStock = getRemainingStock(product, cartStore.cart);
    if (remainingStock <= 0) {
      throw new Error('재고가 부족합니다!');
    }
  };

  const addToCart = useCallback(
    (product: ProductView) => {
      try {
        validateCartItemQuantity(product);

        cartStore.setCart(prevCart => {
          const existingItem = cartStore.findCartItemByProductId(product.id);

          if (!existingItem) {
            return [...prevCart, { product, quantity: 1 }];
          }

          if (existingItem.quantity + 1 > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              notificationTypeSchema.enum.error
            );
            return prevCart;
          }

          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: existingItem.quantity + 1 }
              : item
          );
        });

        addNotification('장바구니에 담았습니다');
      } catch (error) {
        if (error instanceof Error) {
          addNotification(error.message, notificationTypeSchema.enum.error);
        }
        return;
      }
    },
    [cartStore.cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    cartStore.setCart(prevCart =>
      prevCart.filter(item => item.product.id !== productId)
    );
  }, []);

  // PRODUCT ACTIONS
  const addProduct = useCallback(
    (newProduct: Omit<ProductView, 'id'>) => {
      productStore.addProduct({ ...newProduct, id: `p${Date.now()}` });
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updatedProduct: Partial<ProductView>) => {
      productStore.updateProduct(productId, updatedProduct);
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      productStore.removeProductById(productId);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
  );

  // COUPON ACTIONS
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (couponStore.hasCouponWithCode(newCoupon.code)) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      couponStore.addCoupon(newCoupon);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [couponStore.coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      couponStore.removeCouponByCode(couponCode);
      if (selectedCoupon?.code === couponCode) {
        resetSelectedCoupon();
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  return {
    // state
    selectedCoupon,
    notifications,

    //actions
    addNotification,
    applyCoupon,
    completeOrder,
    resetSelectedCoupon,
    removeNotification,
    addToCart,
    removeFromCart,
    addProduct,
    updateProduct,
    deleteProduct,
    addCoupon,
    deleteCoupon,

    // computed-properties
    calculateCartTotal,

    // stores
    productStore,
    couponStore,
    cartStore,
  };
};
