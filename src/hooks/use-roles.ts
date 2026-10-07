import { useAuth } from '@/contexts/auth-context';
import { isAdminAccount, isSectorAccount, normalizeRoles } from '@/lib/sector-access';

export const useRoles = () => {
  const { user } = useAuth();
  return normalizeRoles(user?.roles);
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return isAdminAccount(user?.roles);
};

export const useIsSector = () => {
  const { user } = useAuth();
  return isSectorAccount(user?.roles);
};
