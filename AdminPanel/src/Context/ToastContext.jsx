import React, { createContext, useContext, useState, useCallback } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => {
            // Prevent duplicate messages
            if (prev.some(t => t.message === message)) return prev;
            return [...prev, { id, message, type }];
        });

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
