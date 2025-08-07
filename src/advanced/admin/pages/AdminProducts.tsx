import { useState } from 'react';
import { Product } from '../../shared/types';
import { ProductList } from '../components/products/ProductList';
import { ProductForm } from '../components/products/ProductForm';
import { initialProductForm } from '../../shared/constants';

export const AdminProducts = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<Product>(initialProductForm);

  const startEditProduct = (product: Product) => {
    setProductForm(product);
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => startEditProduct(initialProductForm)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductList startEditProduct={startEditProduct} />

      {showProductForm && (
        <ProductForm
          setShowProductForm={setShowProductForm}
          productForm={productForm}
          setProductForm={setProductForm}
        />
      )}
    </section>
  );
};
