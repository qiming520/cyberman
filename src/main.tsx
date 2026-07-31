import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FirstRunGate } from './features/onboarding/FirstRunGate';
import { installGlobalErrorHandlers } from './stores/errors';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

// Sprint #23：安装全局错误捕获（同步 JS + Promise）
installGlobalErrorHandlers();

createRoot(rootEl).render(
  <StrictMode>
    <FirstRunGate>
      <App />
    </FirstRunGate>
  </StrictMode>
);
