import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';

import { Product, Discount, ProductFormData } from '../..//types';
import { addNotificationAtom, productsAtom } from '../atoms';
import { initialProductForm } from '../constants';
import * as discountModel from '../models/discount';
import * as productModel from '../models/product';

export const useProducts = () => {
  const addNotification = useSetAtom(addNotificationAtom);

  const [products, setProducts] = useAtom(productsAtom);

  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const addProduct = useCallback(
    (newProduct: Omit<Product, 'id'>) => {
      setProducts((prevProducts) => productModel.addProduct(prevProducts, newProduct));
      addNotification({ message: '상품이 추가되었습니다.', type: 'success' });
    },
    [setProducts, addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts((prevProducts) => productModel.updateProduct(prevProducts, productId, updates));
      addNotification({ message: '상품이 수정되었습니다.', type: 'success' });
    },
    [setProducts, addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prevProducts) => productModel.deleteProduct(prevProducts, productId));
      addNotification({ message: '상품이 삭제되었습니다.', type: 'success' });
    },
    [setProducts, addNotification],
  );

  const updateProductStock = useCallback(
    (productId: string, newStock: number) => {
      setProducts((prevProducts) =>
        productModel.updateProductStock(prevProducts, productId, newStock),
      );
    },
    [setProducts],
  );

  const addProductDiscount = useCallback(
    (productId: string, newDiscount: Discount) => {
      setProducts((prevProducts) =>
        discountModel.addProductDiscount(prevProducts, productId, newDiscount),
      );
    },
    [setProducts],
  );

  const removeProductDiscount = useCallback(
    (productId: string, discountQuantity: number) => {
      setProducts((prevProducts) =>
        discountModel.removeProductDiscount(prevProducts, productId, discountQuantity),
      );
    },
    [setProducts],
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const startAddProduct = () => {
    setEditingProduct('new');
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setShowProductForm(true);
  };

  const startEditProduct = (product: Product) => {
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

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    showProductForm,
    setShowProductForm,
    startEditProduct,
    startAddProduct,
    handleProductSubmit,
  };
};
