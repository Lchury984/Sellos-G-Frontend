import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// If VITE_USE_MOCK is set to 'msw', start the Mock Service Worker before rendering
const isMsw = import.meta.env.VITE_USE_MOCK === 'msw';

async function init() {
  if (isMsw) {
    const { worker } = await import('./mocks/browser');
    // Start the worker with quiet logging in development
    await worker.start({ onUnhandledRequest: 'bypass' });
    // eslint-disable-next-line no-console
    console.info('MSW worker started (mode=msw)');
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

init();
