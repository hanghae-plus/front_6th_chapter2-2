import { Product } from '../types';
import { useAtom } from 'jotai';
import { productsAtom } from '../../store/atoms/productsAtom';
import { ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../constants';
import { useNotification } from './useNotification';

export const useProducts = () => {
  const [products, dispatch] = useAtom(productsAtom);
  const { addNotification } = useNotification();

  // 상품 추가
  const addProduct = (product: Omit<Product, 'id'>) => {
    dispatch({ type: ADD_PRODUCT, payload: { product } });
    addNotification('상품이 추가되었습니다.', 'success');
  };

  // 상품 수정
  const updateProduct = (updateProduct: Partial<Product>) => {
    dispatch({ type: UPDATE_PRODUCT, payload: { product: updateProduct } });
    addNotification('상품이 수정되었습니다.', 'success');
  };

  // 상품 삭제
  const deleteProduct = (productId: string) => {
    dispatch({ type: DELETE_PRODUCT, payload: { productId } });
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  // 상품 조회
  const getProduct = (productId: string) => {
    return products.find(product => product.id === productId) || null;
  };

  return {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    getProduct,
  };
};
