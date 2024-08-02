import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import {SvgIcon} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import WcIcon from '@mui/icons-material/Wc';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SavingsIcon from '@mui/icons-material/Savings';
import ChurchIcon from '@mui/icons-material/Church';
import InventoryIcon from '@mui/icons-material/Inventory';

export const items = [
  {
    title: 'Usuarios',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor'],
  },{
    title: 'Iglesias',
    path: '/churchs',
    icon: (
      <SvgIcon fontSize="small">
        <ChurchIcon/>
      </SvgIcon>
    ),
  },
  {
    title: 'Miembros',
    path: '/members',
    icon: (
      <SvgIcon fontSize="small">
        <PeopleIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Encargado', "Secretario"],
  },
  {
    title: 'Ofrendas',
    path: '/offering',
    icon: (
        <SvgIcon fontSize="small">
          <LocalAtmIcon/>
        </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Tesorero'],
  },{
    title:'Banco',
    path: '/bank',
    icon: (
        <SvgIcon fontSize="small">
          <SavingsIcon/>
        </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor'],
  },
  {
    title: 'Bautizos',
    path: '/baptism',
    icon: (
      <SvgIcon fontSize="small">
        <ChildFriendlyIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Secretario'],
  }, {
    title: 'Matrimonios',
    path: '/merriage',
    icon: (
      <SvgIcon fontSize="small">
        <WcIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Secretario'],
  },{
    title: 'Inventario',
    path: '/inventory',
    icon: (
      <SvgIcon fontSize="small">
        <InventoryIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Encargado'],
  },
  {
    title: 'Mi Perfil',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Secretario', 'Encargado', 'Tesorero']
  },
];
