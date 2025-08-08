import type { CartItem, ProductWithUI } from '../../../../types';
import * as productModel from '../../../models/product';
import { formatNumberWon } from '../../../utils/formatters';
import { Table } from '../../ui/Table';

interface Props {
  products: ProductWithUI[];
  cart: CartItem[];
  startEditProduct: (params: { product: ProductWithUI }) => void;
  deleteProduct: (params: { productId: string }) => void;
}

export function ProductsTable({
  products,
  cart,
  startEditProduct,
  deleteProduct,
}: Props) {
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
            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stock > 10
                    ? 'bg-green-100 text-green-800'
                    : stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {stock}개
              </span>
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
