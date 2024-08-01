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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation } from "@apollo/client";
import { DELETE_MEMBER } from "../../services/mutation";
import { useRoles} from "../../hooks/useRoles";
import PropTypes from "prop-types";


export const OfferingsTable = (props) => {
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
  const [deleteMember,{data, loading, error}] = useMutation(DELETE_MEMBER);
  const deleteRut = (rut) => {
    return () => {
      deleteMember({variables: {rut}});
    };
  };
  const roles = useRoles();
  console.log("roles", roles)
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  const convertirAPesosChilenos = (valor) => valor?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}  mb={{minWidth: 2200}} lg={ {minWidth: 2200}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.rut);
                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {customer?.id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {convertirAPesosChilenos(customer?.amount)}
                    </TableCell>
                    <TableCell> {formatDate(customer.date)}</TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell >{customer.state ? "Incluida" : "No Incluida"}</TableCell>
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
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Card>
  );
};

OfferingsTable.propTypes = {
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
