import { useSetAtom } from 'jotai';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Product, ProductWithUI } from '../../types';
import { addProductAtom, productsAtom } from '../atoms/product';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseProductsReturn {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
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

export function useAddProduct() {
  const notify = useNotify();
  const _addProduct = useSetAtom(addProductAtom);

  const addProduct = ({
    newProduct,
  }: {
    newProduct: Omit<ProductWithUI, 'id'>;
  }) => {
    const productWithId: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };

    _addProduct({ newProduct: productWithId });
    notify({
      message: '상품이 추가되었습니다.',
      type: 'success',
    });
  };

  return addProduct;
}
