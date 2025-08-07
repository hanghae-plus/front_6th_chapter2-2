import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { productsAtom } from '../atoms';
import { ProductWithUI, initialProducts } from '../constants/initialData';

interface UseProductsOptions {
  storageKey?: string;
  defaultProducts?: ProductWithUI[];
}

export interface UseProductsReturn {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => { success: boolean; message?: string };
  updateProduct: (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => { success: boolean; message?: string };
  deleteProduct: (productId: string) => void;
}

export const useProducts = (
  options?: UseProductsOptions
): UseProductsReturn => {
  const storageKey = options?.storageKey ?? 'products';
  const defaultProducts = options?.defaultProducts ?? initialProducts;

  const [products, setProducts] = useAtom(productsAtom);

  /* ----------------------------- helpers ----------------------------- */
  const persist = (next: ProductWithUI[]) => {
    setProducts(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  /* ----------------------------- CRUD ----------------------------- */
  const addProduct = useCallback(
    (product: Omit<ProductWithUI, 'id'>) => {
      const newProduct: ProductWithUI = {
        ...product,
        id: `p${Date.now()}`,
      };
      persist([...products, newProduct]);
      return { success: true } as const;
    },
    [products]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const existed = products.find((p) => p.id === productId);
      if (!existed) {
        return { success: false, message: '상품을 찾을 수 없습니다.' } as const;
      }
      const next = products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      );
      persist(next);
      return { success: true } as const;
    },
    [products]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const next = products.filter((p) => p.id !== productId);
      persist(next);
    },
    [products]
  );

  /* ----------------------------- storage sync ----------------------------- */
  const onStorage = useCallback(
    (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const next = JSON.parse(e.newValue) as ProductWithUI[];
          setProducts(next);
        } catch {/* ignore */}
      }
    },
    [storageKey]
  );


  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

