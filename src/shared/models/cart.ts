import { CartItem, Product, Coupon } from '@/types';

export class CartModel {
  constructor(private items: CartItem[] = []) {}

  get cartItems(): CartItem[] {
    return [...this.items];
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  calculateItemTotal(item: CartItem): number {
    const { price } = item.product;
    const { quantity } = item;
    const discount = this.getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  }

  private getMaxApplicableDiscount(item: CartItem): number {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = this.items.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5);
    }

    return baseDiscount;
  }

  calculateTotal(coupon?: Coupon) {
    const totalBeforeDiscount = this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const totalAfterItemDiscounts = this.items.reduce((total, item) => {
      return total + this.calculateItemTotal(item);
    }, 0);

    let totalAfterDiscount = totalAfterItemDiscounts;

    if (coupon) {
      if (coupon.discountType === 'percentage') {
        totalAfterDiscount = totalAfterItemDiscounts * (1 - coupon.discountValue / 100);
      } else if (coupon.discountType === 'amount') {
        totalAfterDiscount = totalAfterItemDiscounts - coupon.discountValue;
      }
      totalAfterDiscount = Math.max(0, totalAfterDiscount);
    }

    const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

    return {
      totalBeforeDiscount,
      totalAfterDiscount,
      totalDiscount,
    };
  }

  addItem(product: Product): CartModel {
    const existingItemIndex = this.items.findIndex((item) => item.product.id === product.id);

    let newItems;
    if (existingItemIndex >= 0) {
      newItems = [...this.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + 1,
      };
    } else {
      newItems = [...this.items, { product, quantity: 1 }];
    }

    return new CartModel(newItems);
  }

  updateItemQuantity(productId: string, quantity: number): CartModel {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    const newItems = this.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    return new CartModel(newItems);
  }

  removeItem(productId: string): CartModel {
    const newItems = this.items.filter((item) => item.product.id !== productId);
    return new CartModel(newItems);
  }

  getRemainingStock(product: Product): number {
    const cartItem = this.items.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }

  clear(): CartModel {
    return new CartModel([]);
  }

  hasProduct(productId: string): boolean {
    return this.items.some((item) => item.product.id === productId);
  }
}
