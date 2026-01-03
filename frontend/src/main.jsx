// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Bounce, ToastContainer } from 'react-toastify';
import { InternshipProvider } from './context/InternshipProvider';
import { AuthProvider } from './context/AuthContext';

// Remove all Clerk imports and code
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InternshipProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            limit={1}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
          <App />
        </InternshipProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);