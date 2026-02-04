import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const getCurrentUserId = () => {
        const userData = localStorage.getItem('userData');
        if (!userData) return 'guest';
        try {
            const user = JSON.parse(userData);
            return user.id || 'guest';
        } catch (e) {
            return 'guest';
        }
    };

    const [userId, setUserId] = useState(getCurrentUserId);

    // Key depends on state userId, not direct localStorage read, to avoid race conditions
    const cartKey = `sweet-tooth-cart-${userId}`;

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem(`sweet-tooth-cart-${getCurrentUserId()}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems, cartKey]);

    // Sync cart when user logs in or out
    useEffect(() => {
        const handleAuthChange = () => {
            const newUserId = getCurrentUserId();
            setUserId(newUserId);

            // Reload cart items for the new user immediately
            const savedCart = localStorage.getItem(`sweet-tooth-cart-${newUserId}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        };

        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    const addToCart = (product, weight, price) => {
        setCartItems((prevItems) => {
            // Create a unique key for item + weight combination
            const itemKey = `${product.id}-${weight}`;
            const existingItemIndex = prevItems.findIndex(
                (item) => `${item.id}-${item.selectedWeight}` === itemKey
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            }

            return [
                ...prevItems,
                {
                    ...product,
                    selectedWeight: weight,
                    priceAtSelectedWeight: price,
                    quantity: 1,
                },
            ];
        });
    };

    const removeFromCart = (itemId, weight) => {
        setCartItems((prevItems) =>
            prevItems.filter(
                (item) => !(item.id === itemId && item.selectedWeight === weight)
            )
        );
    };

    const updateQuantity = (itemId, weight, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId && item.selectedWeight === weight) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.priceAtSelectedWeight * item.quantity,
            0
        );
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
