import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { productService } from '../services/productService';
import { ProductWithUI, ProductForm } from '../types';
import { filterProducts } from '../utils/filters';

/**
 * 상품 관리 Hook의 Props 인터페이스
 */
interface useProductProps {
  searchTerm: string;
  addNotification: (message: string, type: 'success' | 'error') => void;
  initialProducts: ProductWithUI[];
}

/**
 * 상품 상태를 관리하는 커스텀 Hook
 *
 * 기능:
 * - 상품 CRUD 작업 (추가, 수정, 삭제)
 * - 상품 검색 및 필터링
 * - 상품 폼 상태 관리
 * - 편집 모드 관리
 *
 * @param searchTerm - 검색어
 * @param addNotification - 알림 추가 함수
 * @param initialProducts - 초기 상품 목록
 * @returns 상품 관련 상태와 함수들
 */
export const useProducts = ({
  searchTerm,
  addNotification,
  initialProducts,
}: useProductProps) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );
  const [filteredProducts, setFilteredProducts] = useState<ProductWithUI[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    const filtered = filterProducts(products, searchTerm);
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const onStartEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

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
  }, []);

  const onAddProduct = useCallback(
    (product: ProductForm) => {
      const newProduct = productService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );

  const onUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev => {
        return productService.updateProductList(prev, productId, updates);
      });
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );

  const onDeleteProduct = useCallback(
    (productId: string) => {
      const updatedProduct = productService.removeProduct(products, productId);
      setProducts(updatedProduct);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
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
