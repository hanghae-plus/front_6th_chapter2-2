import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Product, ProductWithUI } from '../../types';
import { productsAtom } from '../atoms/product';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseProductsReturn {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  addProduct: (params: { newProduct: Omit<ProductWithUI, 'id'> }) => void;
  updateProduct: (params: {
    productId: string;
    updates: Partial<ProductWithUI>;
  }) => void;
  deleteProduct: (params: { productId: string }) => void;
}

export function useProducts(): UseProductsReturn {
  const notify = useNotify();
  const [products, setProducts] = useAtomWithLocalStorage({
    key: 'products',
    initialValue: initialProducts,
    atom: productsAtom,
  });

  return {
    products,
    setProducts,

    addProduct: useCallback(
      (params) => {
        const newProducts = productModel.addProduct({
          id: `p${Date.now()}`,
          newProduct: params.newProduct,
          products,
        });

        setProducts(newProducts);
        notify({
          message: '상품이 추가되었습니다.',
          type: 'success',
        });
      },
      [setProducts, notify, products]
    ),

    updateProduct: useCallback(
      ({ productId, updates }) => {
        const newProducts = productModel.updateProduct({
          productId,
          updates,
          products,
        });

        setProducts(newProducts);
        notify({
          message: '상품이 수정되었습니다.',
          type: 'success',
        });
      },
      [setProducts, notify, products]
    ),

    deleteProduct: useCallback(
      ({ productId }) => {
        const newProducts = productModel.deleteProduct({
          productId,
          products,
        });

        setProducts(newProducts);
        notify({
          message: '상품이 삭제되었습니다.',
          type: 'success',
        });
      },
      [setProducts, notify, products]
    ),
  };
}
