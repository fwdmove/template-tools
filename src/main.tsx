import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/anton/latin-400.css';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/oswald/latin-500.css';
import '@fontsource/oswald/latin-700.css';
import '@fontsource/teko/latin-500.css';
import '@fontsource/teko/latin-600.css';
import '@fontsource/russo-one/latin-400.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700-italic.css';
import '@fontsource/barlow-condensed/latin-800-italic.css';
import '@fontsource/luckiest-guy/latin-400.css';
import '@fontsource/bangers/latin-400.css';
import '@fontsource/cinzel/latin-600.css';
import '@fontsource/cinzel/latin-800.css';
import '@fontsource/exo-2/latin-700.css';
import '@fontsource/exo-2/latin-800-italic.css';
import '@fontsource/montserrat/latin-500.css';
import '@fontsource/montserrat/latin-600.css';
import '@fontsource/montserrat/latin-800.css';
import '@fontsource/montserrat/latin-900.css';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/roboto-condensed/latin-400.css';
import '@fontsource/roboto-condensed/latin-700.css';
import '@fontsource/roboto-condensed/latin-700-italic.css';
import '@fontsource/caveat/latin-700.css';
import '@fontsource/permanent-marker/latin-400.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
