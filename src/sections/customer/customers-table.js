import PropTypes from 'prop-types';

import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Card,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation } from "@apollo/client";
import { DELETE_MEMBER } from "../../services/mutation";


export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    setLoadingDelete = () => {}
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const [deleteMember,{data, loading, error}] = useMutation(DELETE_MEMBER);
  const deleteRut = (rut) => {
    console.log('loading', loading);
    setLoadingDelete(loading);
    return () => {
      deleteMember({variables: {rut}});
    };
  };
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Fecha Nacimiento</TableCell>
                <TableCell>Fecha Probando</TableCell>
                <TableCell>Fecha Plena</TableCell>
                <TableCell>Editar / Borrar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.rut);
                return (
                  <TableRow hover key={customer.rut} selected={isSelected}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={customer.sexo === 'Masculino' ? '/assets/avatars/hombre.png' : '/assets/avatars/mujer.png'}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer?.names} { customer.lastNameDad} {customer.lastNameMom}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer?.address}
                    </TableCell>
                    <TableCell>+56 {customer.mobile}</TableCell>
                    <TableCell >{formatDate(customer?.dateOfBirth)}</TableCell>
                    <TableCell>{customer?.probationStartDate ? formatDate(customer?.probationStartDate): ""}</TableCell>
                    <TableCell>{customer?.fullMembershipDate ? formatDate(customer?.fullMembershipDate) : ""}</TableCell>
                    <TableCell>
                      <Button
                        size="large"
                        startIcon={<EditIcon style={{ marginRight: '-9px' }} />}
                        variant="contained"
                        component={NextLink}
                        href={`/members/edit?rut=${customer.rut}`}
                      />{' '}
                      <Button
                        size="large"
                        position="center"
                        color="error"
                        startIcon={
                          <DeleteForeverIcon style={{ marginRight: '-9px' }} />
                        }
                        variant="contained"
                        component={NextLink}
                        href="/members"
                        onClick={deleteRut(customer.rut)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  setLoadingDelete: PropTypes.func
};
