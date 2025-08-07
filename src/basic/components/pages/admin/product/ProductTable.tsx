import React from 'react';
import { ProductWithUI } from '../../../../types';
import { formatPrice } from '../../../../utils/formatters';
import { getRemainingStock } from '../../../../utils/calculators';

interface ProductTableProps {
  products: ProductWithUI[];
  cart: any[];
  onStartEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  isAdmin: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  cart,
  onStartEditProduct,
  onDeleteProduct,
  isAdmin,
}) => {
  return (
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
          {products.map(product => (
            <tr key={product.id} className='hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {product.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {formatPrice(
                  product.price,
                  isAdmin,
                  getRemainingStock(product, cart) <= 0
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
                <button
                  onClick={() => onStartEditProduct(product)}
                  className='text-indigo-600 hover:text-indigo-900 mr-3'
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className='text-red-600 hover:text-red-900'
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
