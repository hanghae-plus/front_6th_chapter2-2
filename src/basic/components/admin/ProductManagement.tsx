import { useState } from 'react';
import { CartItem, Product, ProductFormType } from '../../../types';
import { getRemainingStock } from '../../utils/calculations/stockCalculations';
import { formatPriceWithSoldOut } from '../../utils/formatters/priceFormatter';
import Button from '../ui/Button';
import ProductForm from './forms/ProductForm';

interface ProductManagementProps {
  products: Product[];
  isAdmin: boolean;
  cart: CartItem[];
  editingProduct: string | null;
  productForm: ProductFormType;
  handleProductEdit: (product: Product) => void;
  onProductDelete: (id: string) => void;
  onEditClick: (value: string | null) => void;
  onFormChange: (form: ProductFormType) => void;
  handleProductSubmit: (e: React.FormEvent, callback: () => void) => void;
  onNotify: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export default function ProductManagement({
  products,
  isAdmin,
  cart,
  editingProduct,
  productForm,
  handleProductEdit,
  handleProductSubmit,
  onEditClick,
  onFormChange,
  onProductDelete,
  onNotify,
}: ProductManagementProps) {
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>

          <Button
            variant='primary'
            size='md'
            onClick={() => {
              onEditClick('new');
              onFormChange({
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
                  {formatPriceWithSoldOut(
                    product.price,
                    isAdmin,
                    getRemainingStock(product, cart) <= 0,
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}개
                  </span>
                </td>
                <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                  {product.description || '-'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <Button
                    variant='link'
                    onClick={() => {
                      handleProductEdit(product);
                      setShowProductForm(true);
                    }}
                    className='text-indigo-600 hover:text-indigo-900 mr-3'
                  >
                    수정
                  </Button>

                  <Button
                    variant='link'
                    onClick={() => onProductDelete(product.id)}
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
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          handleProductSubmit={handleProductSubmit}
          onToggleForm={setShowProductForm}
          onFormChange={onFormChange}
          onNotify={onNotify}
          onEditClick={onEditClick}
        />
      )}
    </section>
  );
}
