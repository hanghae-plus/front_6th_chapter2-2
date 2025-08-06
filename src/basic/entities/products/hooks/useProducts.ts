import { initialProducts, ProductWithUI } from '@/basic/constants/mocks';
import { useLocalStorage } from '@/basic/hooks';
import { useState } from 'react';

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  return {
    products,
    setProducts,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    productForm,
    setProductForm,
  };
}
