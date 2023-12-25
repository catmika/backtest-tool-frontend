import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';
import { Loader } from './components/Loader';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root not found');
}

const container = createRoot(root);

container.render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </React.StrictMode>,
);
