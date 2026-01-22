import { useState, useEffect } from 'react';

interface Profile {
  rut: string;
  names?: string;
  lastNameDad?: string;
  lastNameMom?: string;
  address?: string;
  email?: string;
  mobile?: string;
  churchId?: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true);
      return;
    }

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
        setIsLoaded(true);
      } catch (error) {
        console.error('Error parsing profile data:', error);
        setProfile(null);
        setIsLoaded(true);
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
    window.localStorage.setItem = function(key: string, value: string) {
      originalSetItem.apply(this, arguments as any);
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
