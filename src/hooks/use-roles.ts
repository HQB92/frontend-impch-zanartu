import { useAuth, ADMIN_ROLE } from '@/contexts/auth-context';

export const useRoles = () => {
  const { user } = useAuth();
  return user?.roles || [];
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return Array.isArray(user?.roles) && user.roles.includes(ADMIN_ROLE);
};
