import { createContext, useContext, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useLocalStorage } from '@/shared/hooks';
import { ProductWithUI } from '@/shared/constants';
import { CartModel } from '@/shared/models';
import { useNotifications } from './notification-context';
import { useProducts } from './product-context';
import { useCoupons } from './coupon-context';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  completeOrder: () => void;
  getStock: (product: Product) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const { products } = useProducts();
  const { addNotification } = useNotifications();
  const { setSelectedCoupon } = useCoupons();

  const getStock = useCallback(
    (product: Product): number => {
      const cartModel = new CartModel(cart);
      return cartModel.getRemainingStock(product);
    },
    [cart]
  );

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getStock(product);

      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [getStock, setCart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [products, removeFromCart, setCart, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart, addNotification, setSelectedCoupon]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    getStock,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
