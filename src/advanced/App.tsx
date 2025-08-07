import React from 'react';
import { useAtom } from 'jotai';
import { AdminPage, MainPage } from './pages';
import { Header, Notification } from './components';
import { initialProducts } from './entities/product';
import { initialCoupons } from './entities/coupon';
import { productsAtom, couponsAtom, isAdminAtom } from './atoms';

const App = () => {
  const [isAdmin] = useAtom(isAdminAtom);
  const [products, setProducts] = useAtom(productsAtom);
  const [coupons, setCoupons] = useAtom(couponsAtom);

  // 초기 데이터 로드 (로컬 스토리지에 데이터가 없을 때만)
  React.useEffect(() => {
    if (products.length === 0) {
      setProducts(initialProducts);
    }
    if (coupons.length === 0) {
      setCoupons(initialCoupons);
    }
  }, [products.length, coupons.length, setProducts, setCoupons]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 메시지 표시 영역 */}
      <Notification />

      {/* 헤더 영역 */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 대시보드
          <AdminPage />
        ) : (
          // 쇼핑몰 메인 페이지
          <MainPage />
        )}
      </main>
    </div>
  );
};

export default App;
