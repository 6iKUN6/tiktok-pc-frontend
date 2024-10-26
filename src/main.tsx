import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOMClient from 'react-dom/client';

import App from './App.tsx';

const rootElement = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootElement!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
