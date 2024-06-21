import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { applyPagination } from 'src/utils/apply-pagination';
import { useLazyQuery } from "@apollo/client";
import Loader from "../../components/loader";
import { GET_ALL_MEMBERS, GET_ALL_MEMBERS_PROBATION } from "../../services/query";

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
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [response, setResponse] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState(0); // Estado para el filtro seleccionado

  const [getMember, { data, loading, error }] = useLazyQuery(GET_ALL_MEMBERS, { fetchPolicy: 'no-cache' });
  const [getMemberProbation, { data: dataProbation, loading: loadingProbation, error: errorProbation }] = useLazyQuery(GET_ALL_MEMBERS_PROBATION, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    if (filter === 0) {
      getMember();
    } else {
      getMemberProbation();
    }
  }, [filter, getMember, getMemberProbation]);

  useEffect(() => {
    if (data) {
      setResponse(data.Member.getAll || []);
    }
  }, [data]);

  useEffect(() => {
    if (dataProbation) {
      setResponse(dataProbation.Member.GetAllMemberProbation || []);
    }
  }, [dataProbation]);

  useEffect(() => {
    if (loadingDelete) {
      if (filter === 0) {
        getMember();
      } else {
        getMemberProbation();
      }
      setLoadingDelete(false);
    }
  }, [loadingDelete, filter, getMember, getMemberProbation]);

  const customers = useCustomers(page, rowsPerPage, response);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value); // Actualiza el estado del filtro
  };

  if (loading || loadingProbation) return <Loader />;
  if (error || errorProbation) return <p>Error loading members</p>;

  return (
      <>
        <Head>
          <title>Miembros</title>
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
                  <Typography variant="h4">Miembros</Typography>
                </Stack>
                <div>
                  <Button
                      color="primary"
                      component={NextLink}
                      href="/members/register"
                      variant="contained"
                  >
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                    Nuevo Miembro
                  </Button>
                </div>
              </Stack>
              <Grid item xs={12} md={3}>
                <TextField
                    fullWidth
                    label="Filtro"
                    name="filtro"
                    select
                    onChange={handleFilter}
                    value={filter} // Establece el valor del select
                >
                  <MenuItem key={0} value={0}>Todos</MenuItem>
                  <MenuItem key={1} value={1}>Miembros Probando</MenuItem>
                </TextField>
              </Grid>
              <CustomersTable
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
            </Stack>
          </Container>
        </Box>
      </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

