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
import {useLazyQuery} from "@apollo/client";
import Loader from "../../components/loader";
import {GET_SUMMARY_OFFERINGS, GET_ALL_OFFERINGS} from "../../services/query";
import {Churchs} from "../../data/member";
import {useCustomers, useCustomerIds} from "../../hooks/useCustomer";
import { OfferingsTableSummary} from "../../sections/offering/offerings-table-summary";
import {useRoles} from "../../hooks/useRoles";
import {useChurch} from "../../hooks/useChurch";


const Page = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [response, setResponse] = useState([]);
    const [responseOffering, setResponseOffering] = useState([]);
    const [page, setPage] = useState(0);
    const [pageOffering, setPageOffering] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowsPerPageOffering, setRowsPerPageOffering] = useState(10);
    const roles = useRoles();
    const church = useChurch();
    const [search, setSearch] = useState({
        churchId: (roles.includes('Administrador') || roles.includes('Pastor')) ? null : church,
        mes: currentMonth,
        anio: currentYear
    })

    const [getSummary, {data, loading, error}] = useLazyQuery(GET_SUMMARY_OFFERINGS, {
        fetchPolicy: 'no-cache',
        variables: {
            churchId: (roles.includes('Administrador') || roles.includes('Pastor')) ? null : parseInt(church),
            mes: search.mes,
            anio: search.anio
        }
    });

    const [getAllOfferings, {data:dataOffering, loading:loadingOffering, error:errorOffering}] = useLazyQuery(GET_ALL_OFFERINGS, {
        fetchPolicy: 'no-cache',
        variables: {
            churchId: search.churchId,
            mes: search.mes,
            anio: search.anio
        }
    });

    useEffect(() => {
        if (roles.includes('Administrador') || roles.includes('Pastor')) {
            getSummary({
                variables: {
                    churchId: null,
                    mes: search.mes,
                    anio: search.anio
                }
            });
        }

        getAllOfferings({
            variables: {
                churchId: search.churchId,
                mes: search.mes,
                anio: search.anio
            }
        })
    }, []);

    useEffect(() => {
        if (roles.includes('Administrador') || roles.includes('Pastor')) {
            getSummary({
                variables: {
                    churchId: (roles.includes('Administrador') || roles.includes('Pastor')) ? null : parseInt(church),
                    mes: search.mes,
                    anio: search.anio
                }
            });
        }
        getAllOfferings(
            {
                variables: {
                    churchId: search.churchId,
                    mes: search.mes,
                    anio: search.anio
                }
            }
        )
    }, [search]);

    useEffect(() => {
        if (data) {
            setResponse(data?.Offering?.getSummaryAll || []);
        }
        if (dataOffering) {
            setResponseOffering(dataOffering?.Offering?.getAll || []);
        }
    }, [data, dataOffering]);

    const customers = useCustomers(page, rowsPerPage, response);
    const customersOffering = useCustomers(page, rowsPerPage, responseOffering);
    const customersIds = useCustomerIds(customers);
    const customersIdsOffering = useCustomerIds(customersOffering);
    const customersSelection = useSelection(customersIds);
    const customersSelectionOffering = useSelection(customersIdsOffering);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
    }, []);
    const handlePageChangeOffering = useCallback((event, value) => {
        setPageOffering(value);
    }, []);


    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);

    const handleRowsPerPageChangeOffering = useCallback((event) => {
        setRowsPerPageOffering(parseInt(event.target.value, 10));

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
    if (error) return <Typography variant="body1">Error al cargar los datos</Typography>;

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
                        {
                            roles.includes('Administrador') || roles.includes('Pastor') ?
                        <Box>

                            <Typography variant="subtitle1">
                                Resumen general
                            </Typography>
                            {
                                data?.Offering?.getSummaryAll?.length > 0 ?
                                  <OfferingsTableSummary
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
                                  />
                                    : <Typography variant="body1">No hay datos</Typography>
                            }

                        </Box> : null
                        }
                        <Box>
                            <Typography variant="subtitle1">
                                Resumen Detallado
                                <Grid container spacing={4}>
                                    {
                                      roles.includes('Administrador') || roles.includes('Pastor') ?

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
                                      </Grid> : null
                                    }
                                </Grid>
                            </Typography>
                            <OfferingsTable
                              count={responseOffering.length}
                              items={customersOffering}
                              onDeselectAll={customersSelectionOffering.handleDeselectAll}
                              onDeselectOne={customersSelectionOffering.handleDeselectOne}
                              onPageChange={handlePageChangeOffering}
                              onRowsPerPageChange={handleRowsPerPageChangeOffering}
                              onSelectAll={customersSelectionOffering.handleSelectAll}
                              onSelectOne={customersSelectionOffering.handleSelectOne}
                              page={pageOffering}
                              rowsPerPage={rowsPerPageOffering}
                              selected={customersSelectionOffering.selected}
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
