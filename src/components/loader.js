import {CircularProgress, Container, Stack} from "@mui/material";

const Loader = () => {
    return (
        <Container maxWidth="xl">
            <Stack spacing={3}>
                <Stack direction="row" justifyContent="center" spacing={4}>
                    <CircularProgress />
                </Stack>
            </Stack>
        </Container>
    );
}

export default Loader;