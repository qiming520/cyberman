import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

// Sprint #3 恢复 StrictMode：production 验证已确认 R3F v8 + React 18 兼容
// dev mode 的 R3F page error 是 Vite + R3F 已知 bug，与 StrictMode 无关
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
