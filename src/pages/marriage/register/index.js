import {useCallback, useEffect, useMemo, useState} from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';

import {
  Box,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { RegisterBaptism } from 'src/sections/baptism/registerBaptism';




const Page = () => {

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
                <Typography variant="h4">Registrar Matrimonio</Typography>
              </Stack>
            </Stack>
            <RegisterBaptism  />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
