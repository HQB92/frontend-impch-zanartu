import { useAuth } from '@/contexts/auth-context';

export const useRoles = () => {
  const { user } = useAuth();
  return user?.roles || [];
};
