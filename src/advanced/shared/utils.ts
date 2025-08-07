export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

export const formatUserPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

export const getRemainingStock = (stock: number, quantity?: number): number => {
  return stock - (quantity || 0);
};

/*
const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }
    
    return `₩${price.toLocaleString()}`;
  };


  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find(item => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);
    
    return remaining;
  };
*/
