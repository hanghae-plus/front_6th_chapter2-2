import { useAtom } from "jotai";
import { isAdminAtom, searchTermAtom } from "./atoms/appAtoms";
import { CartPage } from "./components/CartPage";
import { AdminPage } from "./components/AdminPage";
import { useCart } from "./hooks/useCart";
import { useNotifications } from "./hooks/useNotifications";

import { CartIcon } from "./components/icons";
import { ToastContainer } from "./components/ui";

const App = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);

  const { notifications, removeNotification } = useNotifications();
  const { cart, cartItemCount } = useCart();

  // 검색 핸들러 - presenter layer
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <ToastContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />

      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <CartIcon className="w-6 h-6 text-gray-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </>
  );
};

export default App;
