import { useEffect } from 'react';
import Head from 'next/head';
import {
    Box,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { RegisterMember } from 'src/sections/member/registerMember';
import { useRouter } from 'next/router';
import { useLazyQuery } from "@apollo/client";
import { GET_MEMBER_BY_RUT } from "../../../services/query";
import Loader from "../../../components/loader";

const Page = (props) => {
    const router = useRouter();
    const { rut } = router.query;
    const [getMemberByRut, { data, loading, error }] = useLazyQuery(GET_MEMBER_BY_RUT);

    useEffect(() => {
        if (rut) {
            getMemberByRut({ variables: { rut } });
        }
    }, [rut, getMemberByRut]);

    if (loading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;

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
                                <Typography variant="h4">Editar Usuarios</Typography>
                            </Stack>
                        </Stack>
                        <RegisterMember dataEdit={data?.Member?.getByRut} />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
