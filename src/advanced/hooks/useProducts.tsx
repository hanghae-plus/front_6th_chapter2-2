import { useSetAtom } from 'jotai';
import type { ProductWithUI } from '../../types';
import {
  addProductAtom,
  deleteProductAtom,
  productsAtom,
  updateProductAtom,
} from '../atoms/product';
import { initialProducts } from '../constants';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

export function useProducts(): ProductWithUI[] {
  const [products] = useAtomWithLocalStorage({
    key: 'products',
    initialValue: initialProducts,
    atom: productsAtom,
  });

  return products;
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

export function useDeleteProduct() {
  const notify = useNotify();
  const _deleteProduct = useSetAtom(deleteProductAtom);

  const deleteProduct = ({ productId }: { productId: string }) => {
    _deleteProduct({ productId });
    notify({
      message: '상품이 삭제되었습니다.',
      type: 'success',
    });
  };

  return deleteProduct;
}
