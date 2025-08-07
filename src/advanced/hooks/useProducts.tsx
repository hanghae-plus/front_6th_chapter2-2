import { useSetAtom } from 'jotai';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Product, ProductWithUI } from '../../types';
import {
  addProductAtom,
  productsAtom,
  updateProductAtom,
} from '../atoms/product';
import { initialProducts } from '../constants';
import * as productModel from '../models/product';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseProductsReturn {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
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

export function useUpdateProduct() {
  const notify = useNotify();
  const _updateProduct = useSetAtom(updateProductAtom);

  const updateProduct = ({
    productId,
    updates,
  }: {
    productId: string;
    updates: Partial<ProductWithUI>;
  }) => {
    _updateProduct({ productId, updates });
    notify({
      message: '상품이 수정되었습니다.',
      type: 'success',
    });
  };

  return updateProduct;
}
