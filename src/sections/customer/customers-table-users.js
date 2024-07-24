import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

import { useMutation } from "@apollo/client";
import { DELETE_MEMBER } from "../../services/mutation";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from "jspdf";



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

  console.log(items);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const [deleteMember,{data, loading, error}] = useMutation(DELETE_MEMBER);
  const deleteRut = (rut) => {
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
        <Box sx={{ minWidth: 1200 }}  mb={{minWidth: 2200}} lg={ {minWidth: 2200}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>UserName</TableCell>
                <TableCell>Rut</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Reset Pass</TableCell>
                <TableCell>Eliminar</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.rut);
                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell>
                        <Typography variant="subtitle2">
                          {customer?.id}
                        </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {customer?.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                        {customer?.rut}
                    </TableCell>
                    <TableCell >{customer.email}</TableCell>
                    <TableCell >

                    </TableCell>
                    <TableCell>

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
        rowsPerPageOptions={[10, 25, 50]}
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
