import { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { initialProducts, ProductWithUI } from '../constants/mocks';
import { useLocalStorage } from '../hooks/use-local-storage';
import { INITIAL_PRODUCT_FORM, EDITING_STATES } from '../constants/forms';
import { useNotifications } from './notification-context';

interface ProductContextType {
  products: ProductWithUI[];
  setProducts: (products: ProductWithUI[] | ((prev: ProductWithUI[]) => ProductWithUI[])) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  productForm: Omit<ProductWithUI, 'id'>;
  setProductForm: (form: any) => void;
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  startEditProduct: (product: ProductWithUI) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);
  const { addNotification } = useNotifications();

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

  const value: ProductContextType = {
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

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
