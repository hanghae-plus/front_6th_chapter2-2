import { AppContent } from './pages';
import { AppProvider } from './contexts';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
