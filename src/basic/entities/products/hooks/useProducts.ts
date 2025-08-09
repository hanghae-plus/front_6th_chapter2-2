import { initialProducts, ProductWithUI } from '@/shared/constants';
import { useLocalStorage } from '@/shared/hooks';
import { useCallback, useState } from 'react';
import { INITIAL_PRODUCT_FORM, EDITING_STATES } from '@/shared/constants';

interface UseProductsProps {
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function useProducts({ addNotification }: UseProductsProps) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  }, []);

  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (editingProduct && editingProduct !== EDITING_STATES.NEW) {
        updateProduct(editingProduct, productForm);
        setEditingProduct(null);
      } else {
        addProduct(productForm);
      }

      setProductForm(INITIAL_PRODUCT_FORM);
      setEditingProduct(null);
      setShowProductForm(false);
    },
    [editingProduct, productForm, updateProduct, addProduct]
  );

  return {
    products,
    setProducts,
    showProductForm,
    setShowProductForm,
    productForm,
    setProductForm,
    addProduct,
    updateProduct,
    deleteProduct,

    startEditProduct,
    handleProductSubmit,
  };
}
