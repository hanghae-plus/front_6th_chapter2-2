import { Provider } from 'jotai';
import { AppContent } from './AppContent';

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
