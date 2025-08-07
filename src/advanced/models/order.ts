const orderModel = {
  generateOrderNumber: (): string => {
    return `ORD-${Date.now()}`;
  },
};

export default orderModel;
