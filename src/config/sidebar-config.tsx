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
  Music as MusicIcon,
  Receipt as ReceiptIcon,
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
    roles: ['Administrador', 'Pastor', 'Secretario', 'Encargado', 'Tesorero', 'Ofrenda'],
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
    title: 'Gastos',
    path: '/expenses',
    icon: ReceiptIcon,
    roles: ['Administrador', 'Pastor', 'Tesorero', 'Encargado'],
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
    title: 'Repasos Coros Unidos',
    path: '/rehearsals',
    icon: MusicIcon,
    roles: ['Administrador', 'Pastor', 'Encargado'],
  },
  {
    title: 'Mi Perfil',
    path: '/account',
    icon: UserIcon,
    roles: ['Administrador', 'Pastor', 'Secretario', 'Encargado', 'Tesorero'],
  },
  {
    title: 'Bautizos',
    path: '/sector/baptism',
    icon: ChildFriendlyIcon,
    roles: ['PastorSector'],
  },
  {
    title: 'Matrimonios',
    path: '/sector/merriage',
    icon: WcIcon,
    roles: ['PastorSector'],
  },
  {
    title: 'Mi Perfil',
    path: '/sector/profile',
    icon: UserIcon,
    roles: ['PastorSector'],
  },
  {
    title: 'Bautizos Sector',
    path: '/sector/baptism',
    icon: ChildFriendlyIcon,
    roles: ['Administrador'],
  },
  {
    title: 'Matrimonios Sector',
    path: '/sector/merriage',
    icon: WcIcon,
    roles: ['Administrador'],
  },
];
