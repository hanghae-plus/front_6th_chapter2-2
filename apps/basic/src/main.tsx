import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { NotificationProvider } from './services/use-notification-service';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </React.StrictMode>
  );
}
