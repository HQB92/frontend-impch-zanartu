import { useUser } from './useUser';

export const useRoles = () => {
    const user = useUser();
    return user.roles || [];
};
