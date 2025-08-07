import { useState } from 'react';
import { ProductWithUI } from '../../../../entities/product';
import { useProducts } from '../hooks';
import { Button } from '../../../../shared/ui';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

interface ProductManagementProps {
  products: ProductWithUI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}

export default function ProductManagement({
  products,
  setProducts,
  addNotification,
}: ProductManagementProps) {
  const { addProduct, updateProduct, deleteProduct } = useProducts({
    products,
    setProducts,
    addNotification,
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const handleProductSubmit = () => {
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct(productForm);
    }
    resetForm();
  };

  const startEditProduct = (product: ProductWithUI) => {
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

  const resetForm = () => {
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

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <Button onClick={startAddProduct} variant='primary' size='md'>
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={startEditProduct}
        onDelete={deleteProduct}
      />

      {showProductForm && (
        <ProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          onSubmit={handleProductSubmit}
          onCancel={resetForm}
          isEditing={editingProduct !== 'new'}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}
