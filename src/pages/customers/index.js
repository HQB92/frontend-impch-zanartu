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
import { CustomersTable } from 'src/sections/customer/customers-table-users';
import { applyPagination } from 'src/utils/apply-pagination';
import { useLazyQuery } from "@apollo/client";
import Loader from "../../components/loader";
import { GET_ALL_USER } from "../../services/query";
import { Churchs } from "../../data/member";
import { useCustomers, useCustomerIds } from "../../hooks/useCustomer";




const Page = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [response, setResponse] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [getUsers, { data, loading, error }] = useLazyQuery(GET_ALL_USER, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (data) {
      setResponse(data?.User?.getAll || []);
    }
  }, [data]);

  useEffect(() => {
    if (loadingDelete) {
      getUsers();
    }
  }, [loadingDelete, getUsers]);

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
          <title>Usuarios</title>
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
                  <Typography variant="h4">Usuarios</Typography>
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
                    Nuevo usuario
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
              />
            </Stack>
          </Container>
        </Box>
      </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
