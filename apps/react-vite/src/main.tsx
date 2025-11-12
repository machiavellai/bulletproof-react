// React import (namespace) used for JSX runtime and types
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app';
import { enableMocking } from './testing/mocks';

// find the DOM node with id="root" where the app will mount
const root = document.getElementById('root');
// guard: fail fast if there's no root element (prevents silent failures)
if (!root) throw new Error('No root element found');

// enableMocking may perform async setup (e.g. start MSW). Only after it's
// ready do we mount the app. This ensures mocks intercept requests from the
// very first render.
enableMocking().then(() => {
  // create a React root and render the top-level App inside StrictMode
  // StrictMode enables dev-only checks to highlight potential problems.
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
