// src/basic/components/Admin.tsx
import { Product, Coupon } from '../types';
import { formatCurrency } from '../utils/formatters';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onAddProduct: (product: Omit<Product, 'id' | 'discounts'>) => void;
  onUpdateProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onAddCoupon: (coupon: Omit<Coupon, 'code'>) => void;
  onRemoveCoupon: (couponCode: string) => void;
}

export const Admin = ({
  products,
  coupons,
  // Product handlers
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  // Coupon handlers
  onAddCoupon,
  onRemoveCoupon,
}: Props) => {
  // 간단한 폼 상태 관리. 실제 앱에서는 form 라이브러리 사용을 권장.
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    if (name && price > 0 && stock >= 0) {
      onAddProduct({ name, price, stock });
      e.currentTarget.reset();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      
      {/* 상품 관리 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
        <form onSubmit={handleAddProduct} className="mb-4 p-4 border rounded-lg">
          <input name="name" placeholder="상품명" className="p-2 border rounded mr-2" />
          <input name="price" type="number" placeholder="가격" className="p-2 border rounded mr-2" />
          <input name="stock" type="number" placeholder="재고" className="p-2 border rounded mr-2" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">상품 추가</button>
        </form>
        <ul>
          {products.map(p => (
            <li key={p.id} className="flex justify-between items-center p-2 border-b">
              <span>{p.name} ({formatCurrency(p.price)}, 재고: {p.stock})</span>
              <button onClick={() => onRemoveProduct(p.id)} className="text-red-500">삭제</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 쿠폰 관리 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
        {/* 쿠폰 추가 폼 (간략화) */}
        <ul>
          {coupons.map(c => (
            <li key={c.code} className="flex justify-between items-center p-2 border-b">
              <span>{c.name} ({c.code})</span>
              <button onClick={() => onRemoveCoupon(c.code)} className="text-red-500">삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
