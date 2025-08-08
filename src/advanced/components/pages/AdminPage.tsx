// 상품관리
// 새 상품 추가
// 상품 productForm
// 상품 추가 handle
// 할인 추가 handle
// 상품수정 handle
// 상품 삭제 handle

// 쿠폰 관리
// 새 쿠폰 추가
import { Coupon } from '../../../types';
import { ProductWithUI } from '../AppContainer';
import CouponsTab from '../tab/CouponsTab';
import ProductsTab from '../tab/ProductsTab';
type NotificationType = 'error' | 'success' | 'warning';

type AdminPageProps = {
  setActiveTab: (tab: 'products' | 'coupons') => void;
  activeTab: 'products' | 'coupons';
  products: ProductWithUI[];
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type?: NotificationType) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  deleteProduct: (productId: string) => void; // ✅ 이 줄이 핵심
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
};

export default function AdminPage({
  setActiveTab,
  activeTab,
  products,
  formatPrice,
  addNotification,
  setCoupons,
  setSelectedCoupon,
  selectedCoupon,
  coupons,
  deleteProduct,
}: AdminPageProps) {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      {/* 상품버튼 & 쿠폰버튼  */}
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductsTab
          addNotification={addNotification}
          formatPrice={formatPrice}
          products={products}
          deleteProduct={deleteProduct}
        />
      ) : (
        <CouponsTab
          coupons={coupons}
          addNotification={addNotification}
          setCoupons={setCoupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </div>
  );
}
