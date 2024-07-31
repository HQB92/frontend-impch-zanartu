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
import { CustomersTable } from 'src/sections/baptism/customers-table-baptism';
import { applyPagination } from 'src/utils/apply-pagination';
import { useLazyQuery } from "@apollo/client";
import Loader from "../../components/loader";
import { GET_ALL_MERRIAGE} from "../../services/query";
import { Churchs } from "../../data/member";

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
  const [typeMember, setTypeMember] = useState(0);
  const [churchId, setChurchId] = useState(0);

  const [getMerriage, { data, loading, error }] = useLazyQuery(GET_ALL_MERRIAGE, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    getMerriage();
  }, [getMerriage]);

  useEffect(() => {
    if (data) {
      setResponse(data?.MerriageRecord?.getAll || []);
    }
  }, [data]);

  useEffect(() => {
    if (loadingDelete) {
      getMerriage();
      setLoadingDelete(false);
    }
  }, [loadingDelete, getMerriage]);

  const customers = useCustomers(page, rowsPerPage, response);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handleTypeMemberChange = (event) => {
    setTypeMember(parseInt(event.target.value, 10)); // Actualiza el estado del filtro de tipo de miembro
  };

  const handleChurchIdChange = (event) => {
    setChurchId(parseInt(event.target.value, 10)); // Actualiza el estado del filtro de iglesia
  };

  if (loading) return <Loader />;
  if (error) return <p>Error loading members</p>;

  return (
      <>
        <Head>
          <title>Matrimonios</title>
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
                  <Typography variant="h4">Matrimonios</Typography>
                </Stack>
                <div>
                  <Button
                      color="primary"
                      component={NextLink}
                      href="/baptism/register"
                      variant="contained"
                  >
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                    Nuevo Matrimonio
                  </Button>
                </div>
              </Stack>

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
