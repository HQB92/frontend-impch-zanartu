import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext({ undefined });

export const AppProvider = ({ children }) => {
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const updateAppState = () => {
            try {
                // Actualizar usuario
                const userData = window.localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }

                // Actualizar perfil
                const profileData = window.localStorage.getItem('profile');
                if (profileData) {
                    const parsedProfile = JSON.parse(profileData);
                    if (parsedProfile.rut) {
                        setProfile(parsedProfile);
                        setIsProfileLoaded(true);
                    } else {
                        setProfile(null);
                        setIsProfileLoaded(false);
                    }
                } else {
                    setProfile(null);
                    setIsProfileLoaded(false);
                }
            } catch (error) {
                console.error('Error updating app state:', error);
                setUser(null);
                setProfile(null);
                setIsProfileLoaded(false);
            }
        };

        // Actualizar estado inicialmente
        updateAppState();

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            updateAppState();
        };

        window.addEventListener('storage', handleStorageChange);

        // También escuchar cambios locales
        const originalSetItem = window.localStorage.setItem;
        window.localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            if (key === 'user' || key === 'profile') {
                handleStorageChange();
            }
        };

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.localStorage.setItem = originalSetItem;
        };
    }, []);

    const value = {
        user,
        profile,
        isProfileLoaded,
        isAuthenticated: !!user,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};