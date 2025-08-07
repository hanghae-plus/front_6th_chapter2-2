import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  productsAtom,
  editingProductAtom,
  productFormAtom,
  filteredProductsAtom,
} from '../atoms/productAtoms';
import { showProductFormAtom } from '../atoms/uiAtoms';
import { initialProducts } from '../data/initialData';
import { productService } from '../services/productService';
import { ProductWithUI, ProductForm } from '../types';
import { useNotifications } from './useNotifications';

/**
 * 상품 상태를 관리하는 커스텀 Hook (완전 Jotai 기반)
 *
 * 기능:
 * - 상품 CRUD 작업 (추가, 수정, 삭제)
 * - 상품 검색 및 필터링
 * - 상품 폼 상태 관리
 * - 편집 모드 관리
 *
 * @returns 상품 관련 상태와 함수들
 */
export const useProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const [filteredProducts] = useAtom(filteredProductsAtom);
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [showProductForm, setShowProductForm] = useAtom(showProductFormAtom);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (products.length === 0) {
      setProducts(initialProducts);
    }
  }, [products, setProducts]);

  const onStartEditProduct = useCallback(
    (product: ProductWithUI) => {
      setEditingProduct(product.id);
      setProductForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        discounts: product.discounts || [],
      });
      setShowProductForm(true);
    },
    [setEditingProduct, setProductForm, setShowProductForm]
  );

  const resetProductForm = useCallback(() => {
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  }, [setProductForm, setEditingProduct, setShowProductForm]);

  const onAddProduct = useCallback(
    (product: ProductForm) => {
      const newProduct = productService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  const onUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev => {
        return productService.updateProductList(prev, productId, updates);
      });
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  const onDeleteProduct = useCallback(
    (productId: string) => {
      const updatedProduct = productService.removeProduct(products, productId);
      setProducts(updatedProduct);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [products, setProducts, addNotification]
  );

  return {
    products,
    editingProduct,
    productForm,
    showProductForm,
    filteredProducts,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onStartEditProduct,
    resetProductForm,
    setProductForm,
    setEditingProduct,
    setShowProductForm,
  };
};
