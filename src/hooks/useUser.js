import { useState, useEffect } from 'react';

export function useUser() {
    const [user, setUser] = useState(() => {
        try {
            const data = window.localStorage.getItem('user');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error parsing user data:', error);
            return {};
        }
    });

    useEffect(() => {
        const updateUser = () => {
            try {
                const data = window.localStorage.getItem('user');
                if (data) {
                    setUser(JSON.parse(data));
                } else {
                    setUser({});
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUser({});
            }
        };

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            updateUser();
        };

        window.addEventListener('storage', handleStorageChange);

        // También escuchar cambios locales (para el mismo tab)
        const originalSetItem = window.localStorage.setItem;
        window.localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            if (key === 'user') {
                handleStorageChange();
            }
        };

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.localStorage.setItem = originalSetItem;
        };
    }, []);

    return user;
}
