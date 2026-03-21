import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './Store/store.js'
import { ToastProvider } from './Context/ToastContext.jsx'
import { ConfirmProvider } from './Context/ConfirmContext.jsx'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

import { getImageUrl } from './api/imageUtils.js';

const DynamicLogo = ({ type }) => {
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";
        const res = await axios.get(`${baseURL}/admin/admin-profile`);
        const logoPath = type === 'backend' ? res.data.backend_logo : res.data.frontend_logo;
        if (logoPath) {
          const link = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = getImageUrl(logoPath, baseURL);
          }
        }
      } catch (err) {
        console.error("Favicon failed to load", err);
      }
    };
    fetchLogo();
  }, [type]);
  return null;
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastProvider>
      <ConfirmProvider>
        <DynamicLogo type="backend" />
        <App />
      </ConfirmProvider>
    </ToastProvider>
  </Provider>
)