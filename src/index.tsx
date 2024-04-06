import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

import './style.css';
import App from './App';
import { store } from './store';
import { Loader } from './components/Loader';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root not found');
}

const container = createRoot(root);

container.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
