import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
import { ConfirmProvider } from './Context/ConfirmContext.jsx';

import { getImageUrl } from './api/imageUtils';

const DynamicLogo = () => {
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";
        const res = await axios.get(`${baseURL}/admin/admin-profile`);
        if (res.data.frontend_logo) {
          const link = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = getImageUrl(res.data.frontend_logo, baseURL);
          }
        }
      } catch (err) {
        console.error("Favicon failed to load", err);
      }
    };
    fetchLogo();
  }, []);
  return null;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfirmProvider>
      <DynamicLogo />
      <App />
    </ConfirmProvider>
  </StrictMode>,
)

