import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import WcIcon from '@mui/icons-material/Wc';

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
        title: 'Bautizos',
        path: '/baptism',
        icon: (
            <SvgIcon fontSize="small">
                <ChildFriendlyIcon />
            </SvgIcon>
        ),
        subItems: [
            {
                title: 'Listado',
                path: '/baptism',
                icon: (
                    <SvgIcon fontSize="small">
                        <ListAltIcon/>
                    </SvgIcon>
                ),
            },
            {
                title: 'Nuevo',
                path: '/baptism/register',
                icon: (
                    <SvgIcon fontSize="small">
                        <AddBoxIcon/>
                    </SvgIcon>
                ),
            }
        ],
    },{
        title: 'Matrimonios',
        path: '/marriage',
        icon: (
            <SvgIcon fontSize="small">
                <WcIcon />
            </SvgIcon>
        ),
        subItems: [
            {
                title: 'Listado',
                path: '/marriage',
                icon: (
                    <SvgIcon fontSize="small">
                        <ListAltIcon/>
                    </SvgIcon>
                ),
            },
            {
                title: 'Nuevo',
                path: '/marriage/register',
                icon: (
                    <SvgIcon fontSize="small">
                        <AddBoxIcon/>
                    </SvgIcon>
                ),
            }]
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
