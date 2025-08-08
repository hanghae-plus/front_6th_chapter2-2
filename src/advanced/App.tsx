import { Provider } from 'jotai';

import AppContainer from './components/AppContainer';

const App = () => {
  return (
    <Provider>
      <AppContainer />
    </Provider>
  );
};

export default App;
