import { useState, type FormEvent } from 'react';
import type { CartItem, ProductWithUI } from '../../../../types';
import { TabTitle } from '../ui/TabTitle';
import { ProductsForm, type ProductForm } from './ProductsForm';
import { ProductsTable } from './ProductsTable';
import { Button } from './ui/Button';

interface Props {
  products: ProductWithUI[];
  cart: CartItem[];
  isSoldOut: (params: { cart: CartItem[]; product: ProductWithUI }) => boolean;
  addProduct: (params: { newProduct: Omit<ProductWithUI, 'id'> }) => void;
  deleteProduct: (params: { productId: string }) => void;
  updateProduct: (params: {
    productId: string;
    updates: Partial<ProductWithUI>;
  }) => void;
  addNotification: (params: {
    message: string;
    type?: 'error' | 'success' | 'warning';
  }) => void;
}

export function ProductsTab({
  products,
  cart,
  isSoldOut,
  addProduct,
  deleteProduct,
  updateProduct,
  addNotification,
}: Props) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });

  const startEditProduct = ({ product }: { product: ProductWithUI }) => {
    const {
      id,
      name,
      price,
      stock,
      description = '',
      discounts = [],
    } = product;
    setEditingProduct(id);
    setProductForm({
      name,
      price,
      stock,
      description,
      discounts,
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct({
        productId: editingProduct,
        updates: productForm,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        newProduct: {
          ...productForm,
          discounts: productForm.discounts,
        },
      });
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

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <TabTitle>상품 목록</TabTitle>

          <Button
            onClick={() => {
              setEditingProduct('new');
              setProductForm({
                name: '',
                price: 0,
                stock: 0,
                description: '',
                discounts: [],
              });
              setShowProductForm(true);
            }}
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductsTable
        products={products}
        cart={cart}
        isSoldOut={isSoldOut}
        startEditProduct={startEditProduct}
        deleteProduct={deleteProduct}
      />

      {showProductForm && (
        <ProductsForm
          onSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          addNotification={addNotification}
          clearProductsForm={() => {
            setEditingProduct(null);
            setProductForm({
              name: '',
              price: 0,
              stock: 0,
              description: '',
              discounts: [],
            });
            setShowProductForm(false);
          }}
        />
      )}
    </section>
  );
}
