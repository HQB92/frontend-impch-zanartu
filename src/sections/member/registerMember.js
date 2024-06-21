import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Churchs, stateChurch, stateCivil } from '../../data/member';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';
import { CREATE_MEMBER, UPDATE_MEMBER } from "../../services/mutation";
import { useMutation } from "@apollo/client";
import { Loader } from "react-feather";
import { Alert } from "@mui/lab";
import { useRouter } from "next/router";

export const RegisterMember = (props) => {
  const initialState = {
    rut: '',
    names: '',
    lastNameMom: '',
    lastNameDad: '',
    dateOfBirth: '',
    probationStartDate: null,
    fullMembershipDate:  null,
    email: '',
    mobile: '',
    telephone: '',
    address: '',
    churchId: '',
    maritalStatus: '',
    statusId: '',
    sexo: '',
  };

  const [member, setMember] = useState(initialState);
  const [createMember, { data, loading, error }] = useMutation(CREATE_MEMBER);
  const [updateMember, { data: dataUpdate, loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_MEMBER);
  const router = useRouter();

  useEffect(() => {
    if (props?.dataEdit) {
      setMember({
        ...props.dataEdit,
        dateOfBirth: formatDate(props.dataEdit.dateOfBirth),
        probationStartDate: formatDate(props.dataEdit.probationStartDate),
        fullMembershipDate: formatDate(props.dataEdit.fullMembershipDate),
      });
    }
  }, [props?.dataEdit]);

  useEffect(() => {
    if (member.rut) {
      handleFormato();
    }
  }, [member.rut]);

  useEffect(() => {
    if (data || dataUpdate) {
      setTimeout(() => {
        router.push('/members');
      }, 3000);
    }
  }, [data, dataUpdate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormato = () => {
    if (validateRut(member.rut)) {
      setMember((prev) => ({
        ...prev,
        rut: formatRut(member.rut, RutFormat.DOTS_DASH),
      }));
    }
  };

  const handleUppercase = (data) => {
    return data
        .toLowerCase()
        .replace(/(?:^|\s)([a-zñ])/g, (match) => match.toUpperCase())
        .replace(/ñ/g, 'Ñ');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mutation = props.dataEdit ? updateMember : createMember;
    mutation({
      variables: {
        member: {
          ...member,
        },
      },
    });
  };

  if (loading || loadingUpdate) return <Loader />;
  if (data || dataUpdate) return <Alert severity="success">{"Miembro " + (data ? "Registrado" : "Actualizado") + " Exitosamente"}</Alert>;
  if (error || errorUpdate) return <Alert severity="error">{"Error al " + (data ? "registrar" : "actualizar") + " miembro"}</Alert>;

  return (
      <>
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardHeader subheader="La información que puedes editar" title="Mis Datos" />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Rut"
                        name="rut"
                        value={member.rut}
                        onChange={handleChange}
                        helperText={(!validateRut(member.rut) && member.rut.length < 9) && 'Rut inválido'}
                        error={!validateRut(member.rut) && member.rut.length < 9}
                        required
                        disabled={!!props?.dataEdit}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="names"
                        required
                        onChange={(e) => setMember((prev) => ({ ...prev, names: handleUppercase(e.target.value) }))}
                        value={member.names}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Apellido Paterno"
                        name="lastNameDad"
                        required
                        onChange={(e) => setMember((prev) => ({ ...prev, lastNameDad: handleUppercase(e.target.value) }))}
                        value={member.lastNameDad}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Apellido Materno"
                        name="lastNameMom"
                        required
                        onChange={(e) => setMember((prev) => ({ ...prev, lastNameMom: handleUppercase(e.target.value) }))}
                        value={member.lastNameMom}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        name="dateOfBirth"
                        label="Fecha de Nacimiento"
                        type="date"
                        required
                        onChange={handleChange}
                        value={member.dateOfBirth}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        name="probationStartDate"
                        label="Fecha Miembro Probando"
                        type="date"
                        onChange={handleChange}
                        value={member.probationStartDate}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        name="fullMembershipDate"
                        label="Fecha Plena comunión"
                        type="date"
                        onChange={handleChange}
                        value={member.fullMembershipDate}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        required
                        onChange={handleChange}
                        value={member.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Teléfono Móvil"
                        name="mobile"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">+56</InputAdornment>,
                        }}
                        error={!!(member.mobile && member.mobile.length !== 9)}
                        helperText={member.mobile && member.mobile.length !== 9 && 'El número debe tener 9 dígitos'}
                        onChange={handleChange}
                        value={member.mobile}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Teléfono Fijo"
                        name="telephone"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">+56</InputAdornment>,
                        }}
                        onChange={handleChange}
                        value={member.telephone}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Dirección"
                        name="address"
                        onChange={(e) => setMember((prev) => ({ ...prev, address: handleUppercase(e.target.value) }))}
                        value={member.address}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Iglesia"
                        name="churchId"
                        select
                        required
                        onChange={handleChange}
                        value={member.churchId}
                    >
                      {Churchs.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Estado Civil"
                        name="maritalStatus"
                        select
                        required
                        onChange={handleChange}
                        value={member.maritalStatus}
                    >
                      {stateCivil.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Sexo"
                        name="sexo"
                        select
                        required
                        onChange={handleChange}
                        value={member.sexo}
                    >
                      <MenuItem key={"M"}  value="Masculino">Masculino</MenuItem>
                      <MenuItem key={"F"} value="Femenino">Femenino</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Estado"
                        name="statusId"
                        select
                        required
                        onChange={handleChange}
                        value={member.statusId}
                    >
                      {stateChurch.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </CardActions>
          </Card>
        </form>
      </>
  );
};
