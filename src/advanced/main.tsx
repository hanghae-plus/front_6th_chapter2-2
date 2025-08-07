import React from 'react';
import ReactDOM from 'react-dom/client';

import { App, GlobalSVGProvider, JotaiProvider, NotificationProvider } from './app';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JotaiProvider>
      <GlobalSVGProvider />
      <NotificationProvider />
      <App />
    </JotaiProvider>
  </React.StrictMode>
);
