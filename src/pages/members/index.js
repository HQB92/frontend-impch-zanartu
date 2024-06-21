import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { useLazyQuery } from "@apollo/client";
import Loader from "../../components/loader";
import {GET_ALL_MEMBERS} from "../../services/query";



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
  const [LoadingDelete, setLoadingDelete] = useState(false)
  const [response, setResponse] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [getMember, { data, loading, error }] = useLazyQuery(GET_ALL_MEMBERS, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    getMember();
  }, [getMember]);

  useEffect(() => {
    if (data) {
      setResponse(data.Member.getAll || []);
    }
  }, [data]);
  useEffect(() => {
    if (LoadingDelete){
      getMember()
    }

  }, [LoadingDelete]);

  const customers = useCustomers(page, rowsPerPage, response);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error loading members</p>;

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
              <CustomersSearch />
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
                  loading={LoadingDelete}
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