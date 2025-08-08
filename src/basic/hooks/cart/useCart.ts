import { useCoupon } from '../coupon/useCoupon';
import { useCartItems } from './useCartItems';
import { ProductWithUI } from '../../../types';
import { validateUpdateQuantity, getCartTotalPrice, UpdateQuantityResult } from '../../utils/cart';

export function useCart() {
  const {
    coupons,
    selectedCoupon,
    updateSelectedCoupon,
    resetSelectedCoupon,
    addCoupon,
    deleteCoupon,
    handleChangeCoupon,
    resetCoupons,
  } = useCoupon();

  const { cart, updateCart, addToCart, removeCartItem, totalItemCount, resetCart } = useCartItems();

  const cartTotalPrice = getCartTotalPrice({
    cart,
    selectedCoupon,
  });

  const completeOrder = (callback: () => void) => {
    callback();
    resetCart();
    resetCoupons();
    resetSelectedCoupon();
  };

  const updateQuantity = ({
    productId,
    newQuantity,
    products,
  }: {
    productId: string;
    newQuantity: number;
    products: ProductWithUI[];
  }): UpdateQuantityResult => {
    if (newQuantity <= 0) {
      removeCartItem(productId);
      return { success: true, cart: cart.filter((item) => item.product.id !== productId) };
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, reason: 'PRODUCT_NOT_FOUND' };
    }

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      return { success: false, reason: 'INSUFFICIENT_STOCK', maxStock };
    }

    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);

    return { success: true, cart: updatedCart };
  };

  return {
    //coupons
    coupons,
    selectedCoupon,
    updateSelectedCoupon,
    resetSelectedCoupon,
    addCoupon,
    deleteCoupon,
    handleChangeCoupon,
    updateQuantity,

    // order
    completeOrder,

    // cart
    cart,
    updateCart,
    addToCart,
    removeCartItem,
    totalItemCount,
    cartTotalPrice,
    resetCart,

    validateUpdateQuantity,
  };
}
