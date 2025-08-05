import { useState } from 'react';
import { Coupon } from '../../models/entities';

import { useProducts } from '../../hooks/useProducts.ts';
import { useCart } from '../../hooks/useCart.ts';
import ProductList from '../product/ProductList.tsx';
import CartList from '../cart/CartList.tsx';

const CartView = ({ debouncedSearchTerm }: { debouncedSearchTerm: string }) => {
  const { products } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  // 카트 수량 업데이트

  // const calculateCartTotal = (): {
  //   totalBeforeDiscount: number;
  //   totalAfterDiscount: number;
  // } => {
  //   let totalBeforeDiscount = 0;
  //   let totalAfterDiscount = 0;
  //
  //   cart.forEach(item => {
  //     const itemPrice = item.product.price * item.quantity;
  //     totalBeforeDiscount += itemPrice;
  //     totalAfterDiscount += calculateItemTotal(item);
  //   });
  //
  //   if (selectedCoupon) {
  //     if (selectedCoupon.discountType === 'amount') {
  //       totalAfterDiscount = Math.max(
  //         0,
  //         totalAfterDiscount - selectedCoupon.discountValue
  //       );
  //     } else {
  //       totalAfterDiscount = Math.round(
  //         totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
  //       );
  //     }
  //   }
  //
  //   return {
  //     totalBeforeDiscount: Math.round(totalBeforeDiscount),
  //     totalAfterDiscount: Math.round(totalAfterDiscount),
  //   };
  // };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList />
      </div>

      <CartList />
    </div>
  );
};

export default CartView;
