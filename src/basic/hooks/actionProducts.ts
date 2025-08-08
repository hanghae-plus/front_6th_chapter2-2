import { ProductWithUI } from '../App';

interface actionProductsProps {
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
}

export default function actionProducts({ setProducts }: actionProductsProps) {
  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
  };

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  };
  return {
    updateProduct,
    addProduct,
  };
}
