import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
  SvgIcon,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { display } from '@mui/system';

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
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const router = useRouter();
  const handleClick = () => {
    alert('¿Está seguro que desea eliminar este miembro?');
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Fecha Nacimiento</TableCell>
                <TableCell>Fecha Probando</TableCell>
                <TableCell>Fecha Plena</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.address.city}, {customer.address.state},{' '}
                      {customer.address.country}
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      <Button
                        size="large"
                        startIcon={<EditIcon style={{ marginRight: '-9px' }} />}
                        variant="contained"
                        component={NextLink}
                        href={`/members/editar?id=${customer.id}`}
                      />{' '}
                      <Button
                        size="large"
                        position="center"
                        color="error"
                        startIcon={
                          <DeleteForeverIcon style={{ marginRight: '-9px' }} />
                        }
                        variant="contained"
                        onClick={handleClick}
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
};
