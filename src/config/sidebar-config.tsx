import { 
  Users as UsersIcon,
  User as UserIcon,
  Users as PeopleIcon,
  Baby as ChildFriendlyIcon,
  Heart as WcIcon,
  DollarSign as LocalAtmIcon,
  PiggyBank as SavingsIcon,
  Church as ChurchIcon,
  Package as InventoryIcon,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  subItems?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Usuarios',
    path: '/customers',
    icon: UsersIcon,
    roles: ['Administrador', 'Pastor'],
  },
  {
    title: 'Iglesias',
    path: '/churchs',
    icon: ChurchIcon,
  },
  {
    title: 'Miembros',
    path: '/members',
    icon: PeopleIcon,
    roles: ['Administrador', 'Pastor', 'Encargado', 'Secretario'],
  },
  {
    title: 'Ofrendas',
    path: '/offering',
    icon: LocalAtmIcon,
    roles: ['Administrador', 'Pastor', 'Tesorero', 'Ofrenda'],
  },
  {
    title: 'Banco',
    path: '/bank',
    icon: SavingsIcon,
    roles: ['Administrador', 'Pastor'],
  },
  {
    title: 'Bautizos',
    path: '/baptism',
    icon: ChildFriendlyIcon,
    roles: ['Administrador', 'Pastor', 'Secretario'],
  },
  {
    title: 'Matrimonios',
    path: '/merriage',
    icon: WcIcon,
    roles: ['Administrador', 'Pastor', 'Secretario'],
  },
  {
    title: 'Inventario',
    path: '/inventory',
    icon: InventoryIcon,
    roles: ['Administrador', 'Pastor', 'Encargado'],
  },
  {
    title: 'Mi Perfil',
    path: '/account',
    icon: UserIcon,
    roles: ['Administrador', 'Pastor', 'Secretario', 'Encargado', 'Tesorero'],
  },
];
