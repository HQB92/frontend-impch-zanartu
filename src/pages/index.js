import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useLazyQuery } from "@apollo/client";
import { COUNT_ALL_MEMBERS} from "../services/query";
import {useEffect} from "react";
import Loader from "../components/loader";

const now = new Date();

const Page = () => {
  const [getCountMembers, { data, loading }] = useLazyQuery(COUNT_ALL_MEMBERS, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    getCountMembers();
  }, []);
  if(loading) return <Loader/>
  return (
  <>
    <Head>
      <title>Dashboard</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          <Grid xs={12} sm={6} lg={4}>
            <OverviewBudget positive sx={{ height: '100%' }} value="$240.000" />
          </Grid>
          <Grid xs={12} sm={6} lg={4}>
            <OverviewTotalCustomers sx={{ height: '100%' }} value={ data?.Member?.count} />
          </Grid>
          <Grid xs={12} sm={6} lg={4}>
            <OverviewTotalProfit sx={{ height: '100%' }} value="$550.000" />
          </Grid>
          <Grid xs={12} lg={8}>
            <OverviewSales
              chartSeries={[
                {
                  name: '2023',
                  data: [
                    18000, 16000, 5000, 8000, 3000, 14000, 14000, 16000, 17000,
                    19000, 18000, 20000,
                  ],
                },
                {
                  name: '2022',
                  data: [
                    12000, 11000, 4000, 6000, 2000, 9000, 9000, 10000, 11000,
                    12000, 13000, 13000,
                  ],
                },
                {
                  name: '2023',
                  data: [
                    18000, 16000, 5000, 8000, 3000, 14000, 14000, 16000, 17000,
                    19000, 18000, 20000,
                  ],
                },
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={4}>
            <OverviewTraffic
              chartSeries={[50, 50]}
              labels={['Entrada', 'Salida']}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
