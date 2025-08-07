import { Product } from './models/entities';
import ToastContainer from './components/ui/Toast/ToastContainer.tsx';
import AppHeader from './components/layout/AppHeader.tsx';
import AppMain from './components/layout/AppMain.tsx';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <AppHeader />
      <AppMain />
    </div>
  );
};

export default App;
