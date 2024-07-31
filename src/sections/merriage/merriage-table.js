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
import {Scrollbar} from 'src/components/scrollbar';

import {useMutation} from "@apollo/client";
import {DELETE_MEMBER} from "../../services/mutation";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from "jspdf";
import Matrimonio from '../../img/matrimonioBase64.json';


export const CustomersTable = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {
        },
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = [],
        setLoadingDelete = () => {
        }
    } = props;

    const selectedSome = selected.length > 0 && selected.length < items.length;
    const selectedAll = items.length > 0 && selected.length === items.length;
    const [deleteMember, {data, loading, error}] = useMutation(DELETE_MEMBER);
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

        return [
            day,
            monthName,
            year
        ]
    };


    const generarPDF = (data) => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter",
        });
        doc.setFont("courier", "bold");
        const civilDate = formatDateComplete(formatDate(new Date(data.civilDate)));
        const religiousDate = formatDateComplete(formatDate(new Date(data.religiousDate)));
        doc.setFontSize(16);
        doc.addImage(Matrimonio.data, 'PNG', 0, 0, 216, 216);
        doc.text(`${data.fullNameHusband}`, 26, 117);
        doc.text(`${data.fullNameWife}`, 35, 124);
        doc.text(`${data.civilCode}`, 70, 136);


        doc.text(`${data.civilPlace}`, 60, 160);
        doc.text(`${civilDate[0]}`, 117, 160);
        doc.text(`${civilDate[1]}`, 134, 160);
        doc.text(`${civilDate[2]}`, 173, 160);
        doc.setFont("courier", "bold");
        doc.setFontSize(16)
        doc.text(`${religiousDate[0]} de ${religiousDate[1]} de ${religiousDate[2]}`, 73, 203);
        doc.setFontSize(10);
        doc.text("_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _", 0, 216);
        doc.save(`CertificadoMatrimonio.pdf`);
    }
    return (
        <Card>
            <Scrollbar>
                <Box sx={{minWidth: 1200}} mb={{minWidth: 2200}} lg={{minWidth: 2200}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nº</TableCell>
                                <TableCell>Nombre Esposo</TableCell>
                                <TableCell>Nombre Esposa</TableCell>
                                <TableCell>Fecha Civil</TableCell>
                                <TableCell>Fecha Iglesia</TableCell>
                                <TableCell>Certificado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((customer) => {
                                const isSelected = selected.includes(customer.rut);
                                return (
                                    <TableRow hover key={customer.id} selected={isSelected}>
                                        <TableCell>
                                            {customer?.id}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {customer?.fullNameHusband}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {customer?.fullNameWife}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatDate(customer?.civilDate)}</TableCell>
                                        <TableCell>{formatDate(customer?.religiousDate)}</TableCell>
                                        <TableCell>
                                            {/* crear button que genera el certificado en pdf*/}
                                            <Button
                                                size="large"
                                                variant="contained"
                                                onClick={() => generarPDF(customer)}
                                                startIcon={<PictureAsPdfIcon style={{marginRight: '-9px'}}/>}
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
