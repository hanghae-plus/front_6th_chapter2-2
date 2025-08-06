import { useState } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { useProducts } from "./hooks/useProducts";
import HeaderLayout from "./components/Header/HeaderLayout";
import ShopHeaderContent from "./components/Header/ShopHeaderContent";
import AdminHeaderContent from "./components/Header/AdminHeaderContent";
import AdminPage from "./components/ui/AdminPage";
import ShopPage from "./components/ui/ShopPage";
import Toast from "./components/ui/Toast";
import {
  getRemainingStockAtom,
  addCouponAtom,
  removeCouponAtom,
} from "./atoms";

const App = () => {
  // =========== 페이지 전환 관리 ===========
  const [isAdmin, setIsAdmin] = useState(false);

  // ============ 관리자 페이지용 아톰들만 ============
  const getRemainingStock = useAtomValue(getRemainingStockAtom);
  const addCoupon = useSetAtom(addCouponAtom);
  const removeCoupon = useSetAtom(removeCouponAtom);

  // =========== 상품 관리 ===========
  const {
    // 상품
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    // 검색
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <HeaderLayout>
        {isAdmin ? (
          <AdminHeaderContent onToggleContent={() => setIsAdmin(!isAdmin)} />
        ) : (
          <ShopHeaderContent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleContent={() => setIsAdmin(!isAdmin)}
          />
        )}
      </HeaderLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            getRemainingStock={getRemainingStock}
            onAddCoupon={addCoupon}
            onDeleteCoupon={removeCoupon}
          />
        ) : (
          <ShopPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
