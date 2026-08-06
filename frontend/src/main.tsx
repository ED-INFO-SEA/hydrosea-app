import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { keycloak } from './authentification';

keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false }).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
