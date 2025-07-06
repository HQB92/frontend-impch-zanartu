import { useProfile } from './useProfile';

export const useChurch = () => {
    const { profile } = useProfile();
    return profile?.churchId || null;
};
