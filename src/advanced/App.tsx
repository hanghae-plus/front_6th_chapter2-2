import Header from "./components/Header.tsx"
import Notifications from "./components/Notifications.tsx"
import PageAdmin from "./pages/admin/PageAdmin.tsx"
import PageCart from "./pages/cart/PageCart.tsx"
import { useApp } from "./hooks/useApp.ts"

// 더 이상적인 세분화화와 폴더구조를 해볼 수 있겠지만 basic은 여기까지만 할게요.
const App = () => {
  const { isAdmin } = useApp()

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">{isAdmin ? <PageAdmin /> : <PageCart />}</main>
    </div>
  )
}

export default App
