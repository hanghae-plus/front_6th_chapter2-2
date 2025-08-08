export const orderService = {
  createOrderNumber: () => {
    return `ORD-${Date.now()}`;
  },

  processOrder: (clearCart: () => void, clearSelectedCoupon: () => void) => {
    const orderNumber = orderService.createOrderNumber();
    clearCart();
    clearSelectedCoupon();

    return orderNumber;
  }
};
