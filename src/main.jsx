import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './components/Toast';
import { MovieLibraryProvider } from './state/MovieLibraryContext';
import './styles/tokens.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <MovieLibraryProvider>
          <App />
        </MovieLibraryProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
