import ProductArea from '../shop/product/ProductArea.tsx';
import CheckOutArea from '../shop/checkout/checkoutInfo/CheckOutArea.tsx';

const ShoppingView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductArea />
      </div>

      <CheckOutArea />
    </div>
  );
};

export default ShoppingView;
