import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'jotai';
import { createStore } from 'jotai';
const myStore = createStore();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={myStore}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
