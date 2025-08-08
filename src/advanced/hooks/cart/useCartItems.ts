import { CartItem, ProductWithUI } from '../../../types';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const cartAtom = atomWithStorage<CartItem[]>('cart', []);

const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export function useCartItems() {
  const [cart, setCart] = useAtom(cartAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
  };

  const resetCart = () => {
    setCart([]);
  };

  const addToCart = ({
    product,
    validateUpdateQuantity,
  }: {
    product: ProductWithUI;
    validateUpdateQuantity: ({
      product,
      newQuantity,
    }: {
      product: ProductWithUI;
      newQuantity: number;
    }) => boolean;
  }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (!validateUpdateQuantity({ product, newQuantity })) {
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  return {
    cart,
    updateCart,
    addToCart,
    removeCartItem,
    totalItemCount,
    resetCart,
  };
}
