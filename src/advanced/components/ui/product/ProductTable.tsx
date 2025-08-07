import { Product } from '../../../../types';
import { formatPriceForAdmin } from '../../../utils/formatters';
import ProductTableItem from './ProductTableItem';

interface ProductTableProps {
  products: Product[];
  getRemainingStock: (product: Product) => number;
  startEditProduct: (product: Product) => void;
  deleteProductItem: (productId: string) => void;
}

const ProductTable = ({
  products,
  getRemainingStock,
  startEditProduct,
  deleteProductItem,
}: ProductTableProps) => {
  // 가격 텍스트 처리
  const getPriceText = (product: Product) => {
    if (product && getRemainingStock(product) <= 0) return 'SOLD OUT';
    return formatPriceForAdmin(product.price);
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
          {/* 기존 상품 목록 */}
          {products.map((product) => (
            <ProductTableItem
              key={product.id}
              product={product}
              priceText={getPriceText(product)}
              startEditProduct={startEditProduct}
              deleteProductItem={deleteProductItem}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
