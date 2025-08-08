import { useAtom, useSetAtom } from 'jotai';

import { ProductWithUI } from '../../../types';
import {
  productsAtom,
  deleteProductAtom,
  pushNotificationAtom,
  showProductFormAtom,
  editingProductIdAtom,
  productFormAtom,
} from '../../store/atoms';
import { formatPrice as fmtPrice } from '../../utils/formatters';

export default function ProductTable() {
  const [products] = useAtom(productsAtom);

  const deleteProduct = useSetAtom(deleteProductAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const setShowProductForm = useSetAtom(showProductFormAtom);
  const setEditingProductId = useSetAtom(editingProductIdAtom);
  const setProductForm = useSetAtom(productFormAtom);

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && product.stock <= 0) return 'SOLD OUT';
    }
    return fmtPrice(price);
  };

  const onEditProduct = (product: ProductWithUI) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const onDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    pushNotification({ message: '상품이 삭제되었습니다.', type: 'success' });
  };

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
          {products.map((product) => (
            <tr key={product.id} className='hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {product.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {formatPrice(product.price, product.id)}
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
                  onClick={() => onEditProduct(product)}
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
}
