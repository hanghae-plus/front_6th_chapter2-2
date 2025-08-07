import { CartItem, Coupon, Product } from "../../types";
import cartModel from "../models/cart";
import discountService from "./discount";
import productService from "./product";
import couponService from "./coupon";

export type CartOperationResult =
  | {
      value: CartItem[];
      message: string;
      status: "success";
    }
  | {
      message: string;
      status: "error";
    };

export interface CartTotalResult {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  itemDiscountAmount: number;
  couponDiscountAmount: number;
}

const cartService = {
  calculateItemTotal({
    item,
    cart,
  }: {
    item: CartItem;
    cart: CartItem[];
  }): number {
    return discountService.calculateItemTotal({ item, cart });
  },

  calculateCartTotal({
    cart,
    selectedCoupon,
  }: {
    cart: CartItem[];
    selectedCoupon: Coupon | null;
  }): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += this.calculateItemTotal({ item, cart });
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = couponService.applyAmountDiscount(
          totalAfterDiscount,
          selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = couponService.applyPercentageDiscount(
          totalAfterDiscount,
          selectedCoupon.discountValue
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  },

  // 장바구니 관련 비즈니스 로직
  calculateOriginalPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  },

  calculateItemDiscountRate(
    originalPrice: number,
    calculatedTotal: number
  ): number {
    return couponService.calculateDiscountRate(originalPrice, calculatedTotal);
  },

  hasItemDiscount(originalPrice: number, calculatedTotal: number): boolean {
    return couponService.hasDiscount(originalPrice, calculatedTotal);
  },

  addItemToCart: ({
    cart,
    product,
  }: {
    cart: CartItem[];
    product: Product;
  }): CartOperationResult => {
    const { remainingStock, isOutOfStock, isLowStock } =
      productService.getStockStatus({
        product,
        cart,
      });
    const existingQty = cartModel.getItemQuantity({
      cart,
      productId: product.id,
    });
    if (isOutOfStock || isLowStock || existingQty >= remainingStock) {
      return {
        message: `재고는 ${product.stock}개까지만 있습니다.`,
        status: "error",
      };
    }

    const newCart = existingQty
      ? cartModel.updateItemQuantity({
          cart,
          productId: product.id,
          newQuantity: existingQty + 1,
        })
      : cartModel.addNewItem({ cart, product });

    return {
      value: newCart,
      message: "상품이 추가되었습니다.",
      status: "success",
    };
  },

  updateItemQuantity: ({
    cart,
    productId,
    newQuantity,
  }: {
    cart: CartItem[];
    productId: string;
    newQuantity: number;
  }): CartOperationResult => {
    if (newQuantity <= 0) {
      return {
        value: cartModel.removeItem({ cart, productId }),
        message: "상품이 삭제되었습니다.",
        status: "success",
      };
    }

    const item = cartModel.findItem({ cart, productId });
    if (!item) {
      return {
        message: "상품을 찾을 수 없습니다",
        status: "error",
      };
    }

    if (newQuantity <= 0) {
      return {
        value: cartModel.removeItem({ cart, productId }),
        message: "상품이 삭제되었습니다.",
        status: "success",
      };
    }

    const maxStock = item.product.stock;

    if (newQuantity > maxStock) {
      return {
        message: `재고는 ${maxStock}개까지만 있습니다.`,
        status: "error",
      };
    }

    const updatedCart = cartModel.updateItemQuantity({
      cart,
      productId,
      newQuantity,
    });
    return {
      value: updatedCart,
      message: "상품 수량이 변경되었습니다.",
      status: "success",
    };
  },

  removeItemFromCart: ({
    cart,
    productId,
  }: {
    cart: CartItem[];
    productId: string;
  }): CartOperationResult => {
    return {
      value: cartModel.removeItem({ cart, productId }),
      message: "상품이 삭제되었습니다.",
      status: "success",
    };
  },
};

export default cartService;
