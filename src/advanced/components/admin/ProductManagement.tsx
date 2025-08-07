import { useState } from 'react';

import ProductForm from './ProductForm';
import { ProductWithUI, ProductForm as ProductFormType, CartItem } from '../../../types';
import { defaultProductForm } from '../../constants';
import { formatPrice } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ProductManagementProps {
  products: ProductWithUI[];
  cart: CartItem[];
  addProduct: (
    product: ProductFormType,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  updateProduct: (
    id: string,
    product: ProductFormType,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  deleteProduct: (
    id: string,
    onNotification?: (message: string, type?: 'success' | 'error' | 'warning') => void
  ) => void;
  addNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const ProductManagement = ({
  products,
  cart,
  addProduct,
  updateProduct,
  deleteProduct,
  addNotification,
}: ProductManagementProps) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormType>(defaultProductForm);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm, addNotification);
      setEditingProduct(null);
    } else {
      addProduct(productForm, addNotification);
    }
    setProductForm(defaultProductForm);
    setShowProductForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      discounts: product.discounts,
    });
    setShowProductForm(true);
  };

  return (
    <Card
      padding='md'
      headerStyle='border'
      contentPadding={false}
      header={
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <Button
            onClick={() => {
              setEditingProduct('new');
              setProductForm(defaultProductForm);
              setShowProductForm(true);
            }}
            hasTextSm
            hasRounded
            className='px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800'
          >
            새 상품 추가
          </Button>
        </div>
      }
    >
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                상품명
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                가격
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                재고
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                설명
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                작업
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {products.map((product) => (
              <tr key={product.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {product.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {formatPrice(product.price, product.id, true, products, cart)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <Badge
                    size='xs'
                    rounded='full'
                    className={`inline-flex items-center px-2.5 py-0.5 font-medium ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}개
                  </Badge>
                </td>
                <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                  {product.description || '-'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <Button
                    onClick={() => startEditProduct(product)}
                    className='text-indigo-600 hover:text-indigo-900 mr-3'
                  >
                    수정
                  </Button>
                  <Button
                    onClick={() => deleteProduct(product.id, addNotification)}
                    className='text-red-600 hover:text-red-900'
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductForm
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        setEditingProduct={setEditingProduct}
        handleProductSubmit={handleProductSubmit}
        addNotification={addNotification}
      />
    </Card>
  );
};

export default ProductManagement;
