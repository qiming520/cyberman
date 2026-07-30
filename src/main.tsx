import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  // Sprint #3 临时禁用 StrictMode：R3F + Zustand persist + StrictMode 双调用导致 page error
  // 后续 Sprint 排查根因后重新启用
  <App />
);
