import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    TextField,
    Grid,
    Select,
    OutlinedInput,
    MenuItem,
    Chip,
    InputLabel,
    FormControl,
    CircularProgress
} from '@mui/material';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';
import { CREATE_USER } from "../../services/mutation";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Loader } from "react-feather";
import { Alert } from "@mui/lab";
import { useRouter } from "next/router";
import { GET_MEMBER_BY_RUT } from "../../services/query";

export const RegisterCustomer = () => {
    const initialState = {
        id: '',
        rut: '',
        username: '',
        password: '',
        email: '',
        roles: []
    };

    const [user, setUser] = useState(initialState);
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
    const [getMemberByRut, { data: memberData, loading: memberLoading, error: memberError }] = useLazyQuery(GET_MEMBER_BY_RUT);

    const router = useRouter();

    useEffect(() => {
        if (validateRut(user.rut)) {
            setUser(prev => ({
                ...prev,
                rut: formatRut(user.rut, RutFormat.DOTS_DASH)
            }));
            setUser(prev => ({
                ...prev,
                email: ''
            }));

        }
    }, [user.rut]);


    useEffect(() => {
        if (data) {
            setTimeout(() => router.push('/customers'), 3000);
        }
    }, [data, router]);
    const handleSubmit = (e) => {
        e.preventDefault();
        createUser({ variables: { user: { ...user } } });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prev => ({
            ...prev,
            [name]: name === 'roles' && typeof value === 'string' ? value.split(',') : value
        }));
    };
    useEffect(() => {
        if (memberData) {
            //sino existe se borra el campo mail
            if (!memberData?.Member?.getByRut) {
                setUser(prev => ({
                    ...prev,
                    email: ''
                }));
            } else {
                setUser(prev => ({
                    ...prev,
                    email: memberData?.Member?.getByRut?.email
                }));
            }
        }
    }, [memberData]);

    if (loading) return <Loader />;
    if (data) return <Alert severity="success">{"Usuario Registrado Exitosamente"}</Alert>;
    if (error) return <Alert severity="error">{"Error al registrar Usuario"}</Alert>;

    const names = ['Administrador', 'Pastor', 'Secretario', 'Tesorero', 'Encargado'];

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card>
                <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ m: -1.5 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Nombre de Usuario"
                                    name="username"
                                    onChange={handleChange}
                                    value={user.username}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TextField
                                        fullWidth
                                        label="Rut Miembro"
                                        name="rut"
                                        value={user.rut}
                                        onChange={handleChange}
                                        helperText={user.rut.length >= 7 && (!validateRut(user.rut) && "Rut inválido")}
                                        error={user.rut.length >= 7 && (!validateRut(user.rut)) }
                                        required
                                    />

                                        <Button
                                            onClick={() => getMemberByRut({ variables: { rut: user.rut } })}
                                            variant="contained"
                                            size="large"
                                            disabled={memberLoading}
                                        >
                                            {memberLoading ? <CircularProgress size={24} /> : "Buscar"}
                                        </Button>

                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: !!memberData?.Member?.getByRut?.email }}
                                    value={user.email}
                                    required
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="roles-label">Roles</InputLabel>
                                    <Select
                                        multiple
                                        labelId="roles-label"
                                        name="roles"
                                        value={user.roles}
                                        onChange={handleChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {names.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" disabled={
                        !user.username || !user.rut || !user.email || !user.roles.length
                    }>
                        Guardar
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};
