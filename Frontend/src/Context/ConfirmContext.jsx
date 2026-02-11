import React, { createContext, useContext, useState } from 'react';
import ConfirmDialog from '../Component/ConfirmDialog';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const confirm = (title, message) => {
        return new Promise((resolve) => {
            setConfig({
                isOpen: true,
                title,
                message,
                onConfirm: () => {
                    setConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                {...config}
                onCancel={() => {
                    config.onCancel();
                }}
            />
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
};
