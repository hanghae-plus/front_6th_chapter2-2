import { ProductWithUI } from '../../../../entities/product';
import { Button } from '../../../../shared/ui';
import { formatPrice } from '../../../../shared/utils';

interface ProductTableProps {
  products: ProductWithUI[];
  onEdit: (product: ProductWithUI) => void;
  onDelete: (productId: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  // 관리자용 가격 표시 함수
  const displayAdminPrice = (price: number) => {
    const formatted = formatPrice(price);
    return `${formatted}원`;
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
                {displayAdminPrice(product.price)}
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
                  onClick={() => onEdit(product)}
                  variant='link'
                  className='mr-3'
                >
                  수정
                </Button>
                <Button onClick={() => onDelete(product.id)} variant='danger'>
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
