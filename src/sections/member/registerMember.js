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
  Unstable_Grid2 as Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Churchs, stateChurch, stateCivil } from '../../data/member';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';

import { CREATE_MEMBER, UPDATE_MEMBER } from "../../services/mutation";
import { useMutation } from "@apollo/client";
import { Loader } from "react-feather";
import { Alert } from "@mui/lab";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {date} from "yup";

export const RegisterMember = (props) => {
  const [values, setValues] = useState({
    dateOfBirth: false,
    probationStartDate: false,
    fullMembershipDate: false,
  });

  const initialState = {
    rut: '',
    names: '',
    lastNameMom: '',
    lastNameDad: '',
    dateOfBirth: '',
    probationStartDate: '',
    fullMembershipDate: '',
    email: '',
    mobile: '',
    telephone: '',
    address: '',
    churchId: '',
    maritalStatus: '',
    statusId: '',
    sexo: '',
  };

  const [member, setMember] = useState(props ? props?.dataEdit : initialState);
  const [createMember, { data, loading, error }] = useMutation(CREATE_MEMBER);
  const [updateMember, { data: dataUpdate, loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_MEMBER);
  const router = useRouter();

  const handleChange = (event) => {
    setMember({
      ...member,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormato = () => {
    if (validateRut(member?.rut)) {
      setMember({
        ...member,
        rut: formatRut(member?.rut, RutFormat.DOTS_DASH),
      });
    }
  };

  const handleUppercase = (data) => {
    return data.toLowerCase().replace(/(^|\s)\w/g, (match) => match.toUpperCase());
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleBlur = (field) => {
    if (member[field]) {
      setMember({ ...member, [field]: formatDate(member[field]) });
    }
    setValues({ ...values, [field]: false });
  };

  useEffect(() => {
    handleFormato();
  }, [member?.rut]);

  const formatDate2 = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (data || dataUpdate) {
        setTimeout(() => {
          router.push('/members');
        }, 3000);
      }
    }
  }, [data, dataUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mutation = props.dataEdit ? updateMember : createMember;
    mutation({
      variables: {
        member: {
          rut: member?.rut,
          names: member?.names,
          lastNameDad: member?.lastNameDad,
          lastNameMom: member?.lastNameMom,
          dateOfBirth: member?.dateOfBirth,
          address: member?.address,
          telephone: member?.telephone,
          mobile: member?.mobile,
          email: member?.email,
          maritalStatus: member?.maritalStatus,
          probationStartDate: member?.probationStartDate,
          fullMembershipDate: member?.fullMembershipDate,
          churchId: member?.churchId,
          statusId: member?.statusId,
          sexo: member?.sexo,
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
            <CardHeader subheader="La informacion que puedes editar" title="Mis Datos" />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={4}>
                  <Grid xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Rut"
                        name="rut"
                        value={member?.rut}
                        onChange={handleChange}
                        helperText={(!validateRut(member?.rut) && member?.rut?.length < 9) && 'Rut invalido'}
                        error={!validateRut(member?.rut) && member?.rut?.length < 9}
                        required
                        disabled={props?.dataEdit}
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="firstName"
                        required
                        onChange={(e) => setMember({ ...member, names: handleUppercase(e.target.value) })}
                        value={member?.names}
                    />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Apellido Paterno"
                        name="lastName"
                        required
                        onChange={(e) => setMember({ ...member, lastNameDad: handleUppercase(e.target.value) })}
                        value={member?.lastNameDad}
                    />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Apellido Materno"
                        name="lastName"
                        required
                        onChange={(e) => setMember({ ...member, lastNameMom: handleUppercase(e.target.value) })}
                        value={member?.lastNameMom}
                    />
                  </Grid>
                  <Grid xs={12} md={2}>
                    <TextField
                        fullWidth
                        name="birthday"
                        label="Fecha de Nacimiento"
                        onFocus={() => setValues({ ...values, dateOfBirth: true })}
                        onBlur={() => handleBlur('dateOfBirth')}
                        type="date"
                        required
                        onChange={(e) => setMember({ ...member, dateOfBirth: e.target.value })}
                        value={formatDate2(member?.dateOfBirth)}
                    />
                  </Grid>
                  <Grid xs={12} md={2}>
                    <TextField
                        fullWidth
                        name="probando"
                        label="Fecha Miembro Probando"
                        onFocus={() => setValues({ ...values, probationStartDate: true })}
                        onBlur={() => handleBlur('probationStartDate')}
                        type="date"
                        onChange={(e) => setMember({ ...member, probationStartDate: e.target.value })}
                        value={formatDate2(member?.probationStartDate)}
                    />
                  </Grid>
                  <Grid xs={12} md={2}>
                    <TextField
                        fullWidth
                        name="plenaComunion"
                        label="Fecha Plena comunión"
                        onFocus={() => setValues({ ...values, fullMembershipDate: true })}
                        onBlur={() => handleBlur('fullMembershipDate')}
                        type="date"
                        onChange={(e) => setMember({ ...member, fullMembershipDate: e.target.value })}
                        value={formatDate2(member?.fullMembershipDate)}
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        required
                        onChange={(e) => setMember({ ...member, email: e.target.value })}
                        value={member?.email}
                    />
                  </Grid>
                  <Grid xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Telefono Movil"
                        name="telefono"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">+56</InputAdornment>,
                        }}
                        error={member?.mobile && member?.mobile.length !== 9}
                        helperText={member?.mobile && member?.mobile.length !== 9 && 'El número debe tener 9 dígitos'}
                        onChange={(e) => setMember({ ...member, mobile: e.target.value })}
                        value={member?.mobile}
                    />
                  </Grid>
                  <Grid xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Telefono Fijo"
                        name="telefono"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">+56</InputAdornment>,
                        }}
                        onChange={(e) => setMember({ ...member, telephone: e.target.value })}
                        value={member?.telephone}
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Direccion"
                        name="direccion"
                        onChange={(e) => setMember({ ...member, address: handleUppercase(e.target.value) })}
                        value={member?.address}
                    />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Iglesia"
                        name="iglesia"
                        select
                        required
                        onChange={(e) => setMember({ ...member, churchId: e.target.value })}
                        value={member?.churchId}
                    >
                      {Churchs.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Estado Civil"
                        name="civil"
                        select
                        required
                        onChange={(e) => setMember({ ...member, maritalStatus: e.target.value })}
                        value={member?.maritalStatus}
                    >
                      {stateCivil.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Estado Miembro"
                        name="estado"
                        select
                        required
                        onChange={(e) => setMember({ ...member, statusId: e.target.value })}
                        value={member?.statusId}
                    >
                      {stateChurch.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Sexo"
                        name="sexo"
                        select
                        required
                        onChange={(e) => setMember({ ...member, sexo: e.target.value })}
                        value={member?.sexo}
                    >
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Femenino">Femenino</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">
                Guardar Cambios
              </Button>
            </CardActions>
          </Card>
        </form>
      </>
  );
};
