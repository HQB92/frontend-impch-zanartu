import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import {SvgIcon} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import WcIcon from '@mui/icons-material/Wc';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

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
    subItems: [
      {
        title: 'Listado',
        path: '/customers',
        icon: (
          <SvgIcon fontSize="small">
            <ListAltIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor',]
      },
      {
        title: 'Nuevo',
        path: '/customers/new',
        icon: (
          <SvgIcon fontSize="small">
            <AddBoxIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor']
      },
    ],
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
    subItems: [
      {
        title: 'Listado',
        path: '/members',
        icon: (
          <SvgIcon fontSize="small">
            <ListAltIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Encargado', "Secretario"]
      },
      {
        title: 'Nuevo',
        path: '/members/register',
        icon: (
          <SvgIcon fontSize="small">
            <AddBoxIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Encargado']
      }
    ],
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
    subItems: [
      {
        title: 'Listado',
        path: '/offering',
        icon: (
            <SvgIcon fontSize="small">
              <ListAltIcon/>
            </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor']
      },
      {
        title: 'Nuevo',
        path: '/offering/register',
        icon: (
            <SvgIcon fontSize="small">
              <AddBoxIcon/>
            </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Tesorero']
      }
    ],
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
    subItems: [
      {
        title: 'Listado',
        path: '/baptism',
        icon: (
          <SvgIcon fontSize="small">
            <ListAltIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Secretario']
      },
      {
        title: 'Nuevo',
        path: '/baptism/register',
        icon: (
          <SvgIcon fontSize="small">
            <AddBoxIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Secretario']
      }
    ],
  }, {
    title: 'Matrimonios',
    path: '/marriage',
    icon: (
      <SvgIcon fontSize="small">
        <WcIcon/>
      </SvgIcon>
    ),
    roles: ['Administrador', 'Pastor', 'Secretario'],
    subItems: [
      {
        title: 'Listado',
        path: '/marriage',
        icon: (
          <SvgIcon fontSize="small">
            <ListAltIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Secretario']
      },
      {
        title: 'Nuevo',
        path: '/marriage/register',
        icon: (
          <SvgIcon fontSize="small">
            <AddBoxIcon/>
          </SvgIcon>
        ),
        roles: ['Administrador', 'Pastor', 'Secretario']
      }]
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
