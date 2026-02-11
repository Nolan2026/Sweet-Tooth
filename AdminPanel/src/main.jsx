import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './Store/store.js'
import { ToastProvider } from './Context/ToastContext.jsx'
import { ConfirmProvider } from './Context/ConfirmContext.jsx'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

const DynamicLogo = ({ type }) => {
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/admin-profile`);
        const logoPath = type === 'backend' ? res.data.backend_logo : res.data.frontend_logo;
        if (logoPath) {
          const link = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = `${import.meta.env.VITE_API_BASE_URL}/uploads/${logoPath}`;
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