import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom'
import { router } from './router';
import type { ClientOnErrorFunction } from 'react-router';

const logError: ClientOnErrorFunction = (error, { location, pattern }) => {   // ← NOVO
  console.error(`[Skyline] ${location.pathname} (${pattern})`, error);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} onError={logError} />
  </StrictMode>,
)
