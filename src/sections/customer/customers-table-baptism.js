import PropTypes from 'prop-types';

import NextLink from 'next/link';
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
import Bautizo from '../../img/bautizoBase64.json';

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
  const formatDateComplete = (dateString) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const [day, month, year] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1];

    return `${day} de ${monthName} de ${year}`;
  };



  const generarPDF =  (data) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
    });
      doc.setFont("courier", "bolditalic");
      //doc.setTextColor(18,61,80)
      //tamño de la fuente
      const mootherName = data.motherFullName.split(' ');
      doc.setFontSize(14);
      doc.addImage(Bautizo.data, 'PNG', 5, 5, 205, 205);
      doc.text(`${data.childFullName}`, 56, 97 );
      doc.text(`${data.fatherFullName}`, 25, 104);
      doc.text(`${mootherName[0]}`, 157, 104);
      doc.text(`${mootherName[1]} ${mootherName[2]} ${mootherName[3]}`, 25, 111);
      doc.text(`${formatDate(new Date(data.childDateOfBirth))}`, 39, 118);
      doc.text(`${data.placeOfRegistration}`, 146, 111);
      doc.text(`${data.childRUT}`, 37, 134);
      doc.text(`${data.registrationNumber}`, 128, 134);
      doc.text(`${formatDate(new Date(data.registrationDate))}`, 57, 141);
      doc.setFont("courier", "bold");
      doc.setFontSize(15)
      doc.text(`${formatDateComplete(formatDate(new Date(data.baptismDate)))}`, 76, 190);
      doc.setFontSize(10);
      doc.text("_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _", 0, 216);
      doc.save(`CertificadoBautizo.pdf`);
  }
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}  mb={{minWidth: 2200}} lg={ {minWidth: 2200}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre Niño</TableCell>
                <TableCell>Nombre Padre</TableCell>
                <TableCell>Nombre Madre</TableCell>
                <TableCell>Fecha Nacimiento</TableCell>
                <TableCell>Lugar de Inscripción</TableCell>
                <TableCell>Numero de Inscripción</TableCell>
                <TableCell>Fecha Bautizo</TableCell>
                <TableCell>Fecha Inscripción</TableCell>
                <TableCell>Certificado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.rut);
                return (
                  <TableRow hover key={customer.rut} selected={isSelected}>
                    <TableCell>
                        <Typography variant="subtitle2">
                          {customer?.childFullName}
                        </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {customer?.fatherFullName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {customer?.motherFullName}
                      </Typography>
                    </TableCell>
                    <TableCell >{formatDate(customer?.childDateOfBirth)}</TableCell>
                    <TableCell>{customer.placeOfRegistration}</TableCell>
                    <TableCell>{customer.registrationNumber}</TableCell>
                    <TableCell >{formatDate(customer?.baptismDate)}</TableCell>
                    <TableCell >{formatDate(customer?.registrationDate)}</TableCell>
                    <TableCell>
                      {/* crear button que genera el certificado en pdf*/}
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => generarPDF(customer)}
                            startIcon={<PictureAsPdfIcon style={{ marginRight: '-9px' }} />}
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
