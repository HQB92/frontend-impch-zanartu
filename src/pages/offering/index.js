import {useCallback, useEffect, useMemo, useState} from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
    Box,
    Button,
    Container, Grid, MenuItem,
    Stack,
    SvgIcon, TextField,
    Typography,
} from '@mui/material';
import {useSelection} from 'src/hooks/use-selection';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {OfferingsTable} from 'src/sections/offering/offerings-table';
import {applyPagination} from 'src/utils/apply-pagination';
import {useLazyQuery} from "@apollo/client";
import Loader from "../../components/loader";
import {GET_ALL_MEMBERS} from "../../services/query";
import {Churchs} from "../../data/member";

const useCustomers = (page, rowsPerPage, response) => {
    return useMemo(() => {
        return applyPagination(response, page, rowsPerPage);
    }, [page, rowsPerPage, response]);
};

const useCustomerIds = (customers) => {
    return useMemo(() => {
        return customers.map((customer) => customer.rut);
    }, [customers]);
};

const Page = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState({
        churchId: 0,
        mes: currentMonth,
        anio: currentYear
    })


    const [getMember, {data, loading, error}] = useLazyQuery(GET_ALL_MEMBERS, {
        fetchPolicy: 'no-cache',
        variables: {}
    });

    useEffect(() => {
        getMember({
            variables: {}
        });
    }, [getMember]);

    useEffect(() => {
        if (data) {
            setResponse(data?.Member?.getAll || []);
        }
    }, [data]);
    const refreshData = useCallback(() => {
        getMember({
            variables: {}
        });
    }, [getMember]);

    useEffect(() => {
        if (loadingDelete) {
            getMember({
                variables: {}
            });
            setLoadingDelete(false);
        }
    }, [loadingDelete, getMember]);

    const customers = useCustomers(page, rowsPerPage, response);
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);

    const handleSearchChange = (event) => {
        const {name, value} = event.target;
        setSearch({
            ...search,
            [name]: value
        });
    };

    const anios = function getYearsFrom2024ToCurrent() {
        const years = [];

        for (let year = 2024; year <= currentYear; year++) {
            years.push(year);
        }

        return years;
    }
    if (loading) return <Loader/>;
    if (error) return <p>Error loading members</p>;

    return (
        <>
            <Head>
                <title>Ofrendas</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack direction="row" justifyContent="space-between" spacing={4}>
                            <Stack spacing={1}>
                                <Typography variant="h4">Ofrendas</Typography>
                            </Stack>
                            <div>
                                <Button
                                    color="primary"
                                    component={NextLink}
                                    href="/members/register"
                                    variant="contained"
                                >
                                    <SvgIcon fontSize="small">
                                        <PlusIcon/>
                                    </SvgIcon>
                                    Agregar Ofrenda
                                </Button>
                            </div>
                        </Stack>
                        <Box sx={{m: -1.5}}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Iglesia"
                                        name="churchId"
                                        select
                                        onChange={handleSearchChange}
                                        value={search.churchId}
                                    >
                                        <MenuItem value={0}>Todos</MenuItem>
                                        {Churchs.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="mes"
                                        name="mes"
                                        select
                                        onChange={handleSearchChange}
                                        value={search.mes}
                                    >
                                        <MenuItem value={1}>Enero</MenuItem>
                                        <MenuItem value={2}>Febrero</MenuItem>
                                        <MenuItem value={3}>Marzo</MenuItem>
                                        <MenuItem value={4}>Abril</MenuItem>
                                        <MenuItem value={5}>Mayo</MenuItem>
                                        <MenuItem value={6}>Junio</MenuItem>
                                        <MenuItem value={7}>Julio</MenuItem>
                                        <MenuItem value={8}>Agosto</MenuItem>
                                        <MenuItem value={9}>Septiembre</MenuItem>
                                        <MenuItem value={10}>Octubre</MenuItem>
                                        <MenuItem value={11}>Noviembre</MenuItem>
                                        <MenuItem value={12}>Diciembre</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Año"
                                        name="anio"
                                        select
                                        onChange={handleSearchChange}
                                        value={search.anio}
                                    >
                                        {anios().map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box>
                            Resumen general
                        </Box>
                        <Box>
                            Resumen Detallado
                            <OfferingsTable
                                count={response.length}
                                items={customers}
                                onDeselectAll={customersSelection.handleDeselectAll}
                                onDeselectOne={customersSelection.handleDeselectOne}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                onSelectAll={customersSelection.handleSelectAll}
                                onSelectOne={customersSelection.handleSelectOne}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                selected={customersSelection.selected}
                                loading={loadingDelete}
                                setLoading={setLoadingDelete}
                                refreshData={refreshData}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) =>
    <DashboardLayout>{page}</DashboardLayout>
;

export default Page;
