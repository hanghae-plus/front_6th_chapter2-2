import type { ProductWithUI } from '../../../../types';
import { useCart } from '../../../hooks/useCart';
import { useDeleteProduct, useProducts } from '../../../hooks/useProducts';
import * as productModel from '../../../models/product';
import { formatNumberWon } from '../../../utils/formatters';
import { Badge } from '../../ui/Badge';
import { Table } from '../../ui/Table';

interface Props {
  startEditProduct: (params: { product: ProductWithUI }) => void;
}

export function ProductsTable({ startEditProduct }: Props) {
  const cart = useCart();
  const products = useProducts();
  const deleteProduct = useDeleteProduct();

  return (
    <Table
      datas={products}
      row={{
        상품명: {
          className:
            'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900',
          children: ({ name }) => {
            return name;
          },
        },
        가격: {
          className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
          children: (product) => {
            return productModel.formatPrice({
              cart,
              product,
              formatter: formatNumberWon,
            });
          },
        },
        재고: {
          className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
          children: ({ stock }) => {
            const variant =
              stock > 10 ? 'stock' : stock > 0 ? 'yellow' : 'error';
            return (
              <Badge variant={variant} size="md">
                {stock}개
              </Badge>
            );
          },
        },
        설명: {
          className: 'px-6 py-4 text-sm text-gray-500 max-w-xs truncate',
          children: ({ description }) => {
            return description || '-';
          },
        },
        작업: {
          className:
            'px-6 py-4 whitespace-nowrap text-right text-sm font-medium',
          children: (product) => {
            const { id } = product;

            return (
              <>
                <button
                  onClick={() => startEditProduct({ product })}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => deleteProduct({ productId: id })}
                  className="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </>
            );
          },
        },
      }}
    />
  );
}
