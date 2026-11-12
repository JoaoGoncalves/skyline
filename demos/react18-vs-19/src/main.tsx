import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // igual ao 18 (o ReactDOM.render antigo foi removido no 19)
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
