import { useState, useEffect } from 'react';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const updateProfile = () => {
            try {
                const profileData = window.localStorage.getItem('profile');
                if (profileData) {
                    const parsedProfile = JSON.parse(profileData);
                    if (parsedProfile.rut) {
                        setProfile(parsedProfile);
                        setIsLoaded(true);
                        return;
                    }
                }
                setProfile(null);
                setIsLoaded(false);
            } catch (error) {
                console.error('Error parsing profile data:', error);
                setProfile(null);
                setIsLoaded(false);
            }
        };

        // Actualizar perfil inicialmente
        updateProfile();

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            updateProfile();
        };

        window.addEventListener('storage', handleStorageChange);

        // También escuchar cambios locales (para el mismo tab)
        const originalSetItem = window.localStorage.setItem;
        window.localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            if (key === 'profile') {
                handleStorageChange();
            }
        };

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.localStorage.setItem = originalSetItem;
        };
    }, []);

    return { profile, isLoaded };
};