import React from 'react';
import { ProductWithUI } from '../../../types';
import { ProductTable } from './product/ProductTable';
import { ProductForm } from './product/ProductForm';
import { AddProductButton } from './product/AddProductButton';

interface ProductManagementProps {
  products: ProductWithUI[];
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  editingProduct: string | null;
  showProductForm: boolean;
  cart: any[];
  isAdmin: boolean;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (productId: string, updates: any) => void;
  onDeleteProduct: (productId: string) => void;
  onStartEditProduct: (product: ProductWithUI) => void;
  setProductForm: (form: any) => void;
  setEditingProduct: (productId: string | null) => void;
  setShowProductForm: (show: boolean) => void;
  addNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  productForm,
  editingProduct,
  showProductForm,
  cart,
  isAdmin,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onStartEditProduct,
  setProductForm,
  setEditingProduct,
  setShowProductForm,
  addNotification,
}) => {
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      onUpdateProduct(editingProduct, productForm);
    } else {
      onAddProduct(productForm);
    }
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setShowProductForm(false);
  };

  const handleAddProduct = () => {
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

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <AddProductButton onClick={handleAddProduct} />
        </div>
      </div>

      <ProductTable
        products={products}
        cart={cart}
        onStartEditProduct={onStartEditProduct}
        onDeleteProduct={onDeleteProduct}
        isAdmin={isAdmin}
      />

      {showProductForm && (
        <ProductForm
          productForm={productForm}
          editingProduct={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={handleCancel}
          setProductForm={setProductForm}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};
