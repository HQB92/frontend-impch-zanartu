import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ChurchIcon from '@mui/icons-material/Church';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';

export const items = [
  {
    title: 'Usuarios',
    path: '/customers',
    icon: (
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
    ),
    subItems: [
      {
        title: 'Listado',
        path: '/customers',
        icon: (
            <SvgIcon fontSize="small">
              <ListAltIcon />
            </SvgIcon>
        ),
      },
      {
        title: 'Nuevo',
        path: '/customers/new',
        icon: (
            <SvgIcon fontSize="small">
              <AddBoxIcon />
            </SvgIcon>
        ),
      },
    ],
  },
  {
    title: 'Miembros',
    path: '/members',
    icon: (
        <SvgIcon fontSize="small">
          <PeopleIcon />
        </SvgIcon>
    ),
    subItems: [
      {
        title: 'Listado',
        path: '/members',
        icon: (
            <SvgIcon fontSize="small">
              <ListAltIcon/>
            </SvgIcon>
        ),
      },
      {
        title: 'Nuevo',
        path: '/members/register',
        icon: (
            <SvgIcon fontSize="small">
              <AddBoxIcon/>
            </SvgIcon>
        ),
      }
    ],
  },
  {
    title: 'Mi Perfil',
    path: '/account',
    icon: (
        <SvgIcon fontSize="small">
          <UserIcon />
        </SvgIcon>
    ),
  },
];
