import { useState } from 'react';
import { initialProducts, ProductWithUI } from '../../../constants/mocks';

export function useProducts() {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
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
