import { useState } from "react";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";
import Header from "./components/header";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChangeIsAdmin = () => {
    setIsAdmin(prev=>!prev);
  };
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* 내비게이션 바 */}
      <Header isAdmin={isAdmin} onChangeIsAdmin={handleChangeIsAdmin} />
      {/* 페이지 컨텐츠 */}
      <main className="container mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
}

export default App;
