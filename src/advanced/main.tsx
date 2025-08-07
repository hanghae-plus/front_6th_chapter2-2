import React from 'react';
import ReactDOM from 'react-dom/client';

import { App, GlobalSVGProvider, JotaiProvider } from './app';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JotaiProvider>
      <App />
      <GlobalSVGProvider />
    </JotaiProvider>
  </React.StrictMode>
);
