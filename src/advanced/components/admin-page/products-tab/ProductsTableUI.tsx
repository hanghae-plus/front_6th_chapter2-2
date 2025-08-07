import type { ProductWithUI } from '../../../../types';
import { Badge } from '../../ui/Badge';
import { Table } from '../../ui/Table';

interface ProductsTableUIProps {
  products: Array<{
    id: string;
    name: string;
    formattedPrice: string;
    stock: number;
    stockVariant: 'stock' | 'yellow' | 'error';
    description: string;
    originalProduct: ProductWithUI; // 원본 데이터 보존
  }>;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductsTableUI({
  products,
  onEditProduct,
  onDeleteProduct,
}: ProductsTableUIProps) {
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
          children: ({ formattedPrice }) => {
            return formattedPrice;
          },
        },
        재고: {
          className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
          children: ({ stock, stockVariant }) => {
            return (
              <Badge variant={stockVariant} size="md">
                {stock}개
              </Badge>
            );
          },
        },
        설명: {
          className: 'px-6 py-4 text-sm text-gray-500 max-w-xs truncate',
          children: ({ description }) => {
            return description;
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
                  onClick={() => onEditProduct(product.originalProduct)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteProduct(id)}
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
