import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FirstRunGate } from './features/onboarding/FirstRunGate';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

// Sprint #3 恢复 StrictMode：production 验证已确认 R3F v8 + React 18 兼容
// Sprint #19：包 FirstRunGate（首启动引导，首次访问显示欢迎页）
createRoot(rootEl).render(
  <StrictMode>
    <FirstRunGate>
      <App />
    </FirstRunGate>
  </StrictMode>
);
