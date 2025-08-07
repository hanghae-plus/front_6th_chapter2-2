import { Provider } from 'jotai';
import AppContent from './components/AppContent';

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
