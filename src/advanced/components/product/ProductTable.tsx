import { ProductWithUI } from '../../../types';
import { ProductPrice } from './';

// 상품 목록 테이블
interface ProductTableProps {
  products: ProductWithUI[];
  remainingStock: (product: ProductWithUI) => number;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductTable({
  products,
  remainingStock,
  onEditProduct,
  onDeleteProduct,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <ProductTableHeader />
        <ProductTableBody
          products={products}
          remainingStock={remainingStock}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      </table>
    </div>
  );
}

// 테이블 헤더
function ProductTableHeader() {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          상품명
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          가격
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          재고
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          설명
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          작업
        </th>
      </tr>
    </thead>
  );
}

// 테이블 바디
interface ProductTableBodyProps {
  products: ProductWithUI[];
  remainingStock: (product: ProductWithUI) => number;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
}

function ProductTableBody({
  products,
  remainingStock,
  onEditProduct,
  onDeleteProduct,
}: ProductTableBodyProps) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {products.map((product) => (
        <ProductTableRow
          key={product.id}
          product={product}
          remainingStock={remainingStock(product)}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
    </tbody>
  );
}

// 테이블 행
interface ProductTableRowProps {
  product: ProductWithUI;
  remainingStock: number;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
}

function ProductTableRow({
  product,
  remainingStock,
  onEditProduct,
  onDeleteProduct,
}: ProductTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <ProductNameCell productName={product.name} />
      <ProductPriceCell product={product} remainingStock={remainingStock} />
      <ProductStockCell stock={product.stock} />
      <ProductDescriptionCell description={product.description} />
      <ProductActionsCell
        product={product}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
      />
    </tr>
  );
}

// 상품명 셀
interface ProductNameCellProps {
  productName: string;
}

function ProductNameCell({ productName }: ProductNameCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{productName}</td>
  );
}

// 상품 가격 셀
interface ProductPriceCellProps {
  product: ProductWithUI;
  remainingStock: number;
}

function ProductPriceCell({ product, remainingStock }: ProductPriceCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <ProductPrice product={product} isAdmin={true} remainingStock={remainingStock} />
    </td>
  );
}

// 상품 재고 셀
interface ProductStockCellProps {
  stock: number;
}

function ProductStockCell({ stock }: ProductStockCellProps) {
  const getStockBadgeClass = (stock: number) => {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(
          stock
        )}`}
      >
        {stock}개
      </span>
    </td>
  );
}

// 상품 설명 셀
interface ProductDescriptionCellProps {
  description?: string;
}

function ProductDescriptionCell({ description }: ProductDescriptionCellProps) {
  return (
    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{description || '-'}</td>
  );
}

// 상품 액션 셀
interface ProductActionsCellProps {
  product: ProductWithUI;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
}

function ProductActionsCell({ product, onEditProduct, onDeleteProduct }: ProductActionsCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        onClick={() => onEditProduct(product)}
        className="text-indigo-600 hover:text-indigo-900 mr-3"
      >
        수정
      </button>
      <button
        onClick={() => onDeleteProduct(product.id)}
        className="text-red-600 hover:text-red-900"
      >
        삭제
      </button>
    </td>
  );
}
