import React, { createContext, useContext, useState, useCallback } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`toast-container ${toast.type}`}>
                    <div className="toast-content">
                        <span className="toast-icon">
                            {toast.type === 'success' ? '✅' : '❌'}
                        </span>
                        <p className="toast-message">{toast.message}</p>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};
