import { ProductWithUI } from "../../App";

interface ProductListSummaryProps {
  products: ProductWithUI[];
}

export function ProductListSummary({ products }: ProductListSummaryProps) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
      <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
    </div>
  );
}
