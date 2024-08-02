import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { RegisterOffering } from 'src/sections/offering/registerOffering';


const Page = () => {
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
                <Typography variant="h4">Registrar Ofrenda</Typography>
              </Stack>
            </Stack>
            <RegisterOffering  />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
