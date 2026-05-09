import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';

// Polyfill Buffer for browser environment (required by gray-matter)
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
