import { useState } from 'react';
import { CartItem, Coupon, Product } from '../types';
import { initialCoupons, initialProducts } from '../constants';

export const useAppState = () => {
  const [products, setProductsState] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const setProducts = (
    newProducts: Product[] | ((prev: Product[]) => Product[])
  ) => {
    const updatedProducts =
      typeof newProducts === 'function' ? newProducts(products) : newProducts;
    setProductsState(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const [cart, setCartState] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const setCart = (
    newCart: CartItem[] | ((prev: CartItem[]) => CartItem[])
  ) => {
    const updatedCart = typeof newCart === 'function' ? newCart(cart) : newCart;
    setCartState(updatedCart);

    if (updatedCart.length === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const [coupons, setCouponsState] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const setCoupons = (
    newCoupons: Coupon[] | ((prev: Coupon[]) => Coupon[])
  ) => {
    const updatedCoupons =
      typeof newCoupons === 'function' ? newCoupons(coupons) : newCoupons;
    setCouponsState(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  return {
    products,
    setProducts,
    cart,
    setCart,
    isAdmin,
    setIsAdmin,
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  };
};
