import { useMemo } from 'react';
import { calculateDiscountedPrice } from '../utils/calculateDiscountedPrice';
import { applyBulkDiscount } from '../utils/applyBulkDiscount';
import { applyCouponDiscount } from '../utils/applyCouponDiscount';
import { CartItem, Product } from '../../types';

const BULK_PURCHASE_QUANTITY = 10;
const BULK_PURCHASE_DISCOUNT_RATE = 0.05;
const BULK_PURCHASE_DISCOUNT_LIMIT = 0.5;

export const useCartCalculations = (cart: CartItem[], selectedCoupon: any) => {
  // 할인 적용 가능한 최대 할인율 계산: 수량 할인 + 대량 구매 시 추가 5% 할인, 최대 50% 할인
  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    // 수량 할인
    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= BULK_PURCHASE_QUANTITY);

    if (hasBulkPurchase) {
      return applyBulkDiscount(baseDiscount, BULK_PURCHASE_DISCOUNT_RATE, BULK_PURCHASE_DISCOUNT_LIMIT); // 대량 구매 시 추가 5% 할인, 최대 50% 할인
    }

    return baseDiscount;
  };

  // 할인 적용된 상품 가격 계산 (e.g. 사과 3개 할인 적용 가격)
  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return calculateDiscountedPrice(price, quantity, discount);
  };

  // 상품 재고 수량 확인
  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find(item => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  // 장바구니 총 가격 계산 (할인 적용 전, 후)
  const totals = useMemo(() => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach(item => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    // 쿠폰 할인 적용
    totalAfterDiscount = applyCouponDiscount(totalAfterDiscount, selectedCoupon);

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount)
    };
  }, [cart, selectedCoupon]);

  return {
    getMaxApplicableDiscount,
    calculateItemTotal,
    getRemainingStock,
    totals
  };
};
