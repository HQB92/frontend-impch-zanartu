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
import { useEffect } from 'react';
import { DELETE_USER, RESET_PASSWORD } from "../../services/mutation";
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {useRoles} from "../../hooks/useRoles";


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
        refreshData = () => {},
    } = props;
        const selectedSome = selected.length > 0 && selected.length < items.length;
    const selectedAll = items.length > 0 && selected.length === items.length;
    const [deleteUser, { data, loading, error }] = useMutation(DELETE_USER);
    const [resetPassword, { data: dataReset, loading: loadingReset, error: errorReset }] = useMutation(RESET_PASSWORD);
    const roles = useRoles();
    useEffect(() => {
        if (data) {
            refreshData();
        }
    }, [data, refreshData]);

    const deleteRut = (id) => {
        return () => {
            deleteUser({ variables: { id } }).then(() => {
                refreshData();
            });
        };
    };

    const resetPass = (id) => {
        return () => {
            resetPassword({ variables: { id } }).finally(() => {
                setLoadingDelete(false);
            });
        };
    };

    return (
        <Card>
            <Scrollbar>
                <Box sx={{ minWidth: 400 }} mb={{ minWidth: 2200 }} lg={{ minWidth: 2200 }}>
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
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.roles.map(
                                            (role) => (
                                                <Typography variant="subtitle3" key={role}>
                                                    {role}{', '}
                                                </Typography>
                                            )
                                        )}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="large"
                                                startIcon={<LockResetIcon style={{ marginRight: '-9px' }} />}
                                                variant="contained"
                                                onClick={resetPass(customer.id)}
                                                disabled={!roles.includes('Administrador')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="large"
                                                position="center"
                                                color="error"
                                                startIcon={
                                                    <DeleteForeverIcon style={{ marginRight: '-9px' }} />
                                                }
                                                variant="contained"
                                                onClick={deleteRut(customer.id)}
                                                disabled={
                                                    !roles.includes('Administrador') || !roles.includes('Pastor') || !roles.includes('Secretario')
                                                }
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
    refreshData: PropTypes.func,
};