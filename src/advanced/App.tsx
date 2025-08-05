import { useAtom } from "jotai";
import { isAdminAtom } from "./store";

import Layout from "./components/Layout";
import Header from "./components/Layout/Header";
import AdminPage from "./components/admin/AdminPage";
import CartSection from "./components/cart/CartSection";
import ProductListSection from "./components/product/ProductSection";
import NotificationToast from "./components/ui/UIToast";

function App() {
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <Layout>
      <NotificationToast />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductListSection />
            <div className="lg:col-span-1">
              <CartSection />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default App;
