import { Product, ProductView } from '@/models/product';
import { useState } from 'react';
import ProductForm from './product-form';
import ProductList from './product-list';

type Props = {
  products: Product[];
  productForm: Omit<Product, 'id'>;
  onUpdateForm: (form: Omit<ProductView, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (productId: string) => void;
  formatPrice: (price: number, productId: string) => string;
  startEditProduct: (product: Product) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
};

const ProductSection = ({
  products,
  productForm,
  onUpdateForm,
  onSubmit,
  onDelete,
  formatPrice,
  startEditProduct,
  showProductForm,
  setShowProductForm
}: Props) => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const handleAddNewProduct = () => {
    setEditingProduct('new');
    onUpdateForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: []
    });
    setShowProductForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    onUpdateForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: []
    });
    setShowProductForm(false);
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <button
            onClick={handleAddNewProduct}
            className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'>
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductList
        products={products}
        formatPrice={formatPrice}
        onEdit={startEditProduct}
        onDelete={onDelete}
      />

      {showProductForm && (
        <ProductForm
          productForm={productForm}
          editingProduct={editingProduct}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          onUpdateForm={onUpdateForm}
        />
      )}
    </section>
  );
};

export default ProductSection;
