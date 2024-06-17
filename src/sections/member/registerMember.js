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
import { Churchs, states, stateChurch, stateCivil } from '../../data/member';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';

import { CREATE_MEMBER } from "../../services/mutation";
import { useMutation } from "@apollo/client";
import {Loader} from "react-feather";
import {Alert} from "@mui/lab";

export const RegisterMember = (props) => {
  const [values, setValues] = useState({
    dateOfBirth: false,
    probationStartDate: false,
    fullMembershipDate: false,
  });
  const [member, setMember] = useState({
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
  });

  const [createMember,{ data, loading, error }] = useMutation(CREATE_MEMBER);
  const handleChange = (event) => {
    setMember({
      ...member,
      [event.target.name]: event.target.value,
    });
  };
  const handleFormato = () => {
    if (validateRut(member.rut)) {
      setMember({
        ...member,
        rut: formatRut(member.rut, RutFormat.DOTS_DASH),
      });
    }
  };
  const handleUpercase = (data) => {
    return data.toLowerCase().replace(/(^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
  };
  useEffect(() => {
    handleFormato();
  }, [member.rut]);


  if(error) return <Alert severity="error">{error.message}</Alert>
  if(loading) return <Alert severity="info"><Loader/></Alert>
    if(data) return <Alert severity="success">Miembro Registrado</Alert>


  return (
    <>

      <form autoComplete="off" noValidate onSubmit={e => { e.preventDefault()
        createMember({
          variables: {
          member: {
          rut: member.rut,
          names: member.names,
          lastNameDad: member.lastNameDad,
          lastNameMom: member.lastNameMom,
          dateOfBirth: member.dateOfBirth,
          address: member.address,
          telephone: member.telephone,
          mobile: member.mobile,
          email: member.email,
          maritalStatus: member.maritalStatus,
          probationStartDate: member.probationStartDate,
          fullMembershipDate: member.fullMembershipDate,
          churchId: member.churchId,
          statusId: member.statusId,
          sexo: member.sexo,
      },
      },}) }}>
        <Card>
          <CardHeader
            subheader="La informacion que puedes editar"
            title="Mis Datos"
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={4}>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Rut"
                    name="rut"
                    value={member.rut}
                    onChange={handleChange}
                    helperText={validateRut(member.rut) && 'Rut invalido'}
                    error={!validateRut(member.rut)}
                    required
                    disabled={!props}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="firstName"
                    required
                    onChange={(e) =>
                      setMember({
                        ...member,
                        names: handleUpercase(e.target.value),
                      })
                    }
                    value={member.names}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Apellido Paterno"
                    name="lastName"
                    onChange={(e) =>
                      setMember({
                        ...member,
                        lastNameDad: handleUpercase(e.target.value),
                      })
                    }
                    required
                    value={member.lastNameDad}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Apellido Materno"
                    name="lastName"
                    required
                    onChange={(e) =>
                      setMember({
                        ...member,
                        lastNameMom: handleUpercase(e.target.value),
                      })
                    }
                    value={member.lastNameMom}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    name="birthday"
                    label="Fecha de Nacimiento"
                    onFocus={() => {
                      setValues({ ...values, dateOfBirth: true });
                    }}
                    onBlur={() => {
                      setValues({ ...values, dateOfBirth: false });
                    }}
                    type={values.dateOfBirth ? 'date' : 'text'}
                    required
                    onChange={(e) =>
                      setMember({ ...member, dateOfBirth: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    name="probando"
                    label="Fecha Miembro Probando"
                    onFocus={() => {
                      setValues({ ...values, probationStartDate: true });
                    }}
                    onBlur={() => {
                      setValues({ ...values, probationStartDate: false });
                    }}
                    type={values.probationStartDate ? 'date' : 'text'}
                    onChange={(e) =>
                      setMember({ ...member, probationStartDate: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    name="plenaComunion"
                    label="Fecha Plena comunión"
                    onFocus={() => {
                      setValues({ ...values, fullMembershipDate: true });
                    }}
                    onBlur={() => {
                      setValues({ ...values, fullMembershipDate: false });
                    }}
                    type={values.fullMembershipDate ? 'date' : 'text'}
                    onChange={(e) =>
                      setMember({ ...member, fullMembershipDate: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    required
                    onChange={(e) =>
                      setMember({ ...member, email: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Teléfono Celular"
                    name="phone"
                    type="number"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+56</InputAdornment>
                      ),
                    }}
                    error={
                      member.mobile !== '' ||
                        1 < member.mobile.length < 9
                    }
                    helperText={
                      member.mobile.length !== 9
                        && 'Telefono Incorrecto'
                    }
                    onChange={(e) =>
                      setMember({ ...member, mobile: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Teléfono Fijo"
                    name="phoneHome"
                    type="number"
                    onChange={(e) =>
                      setMember({ ...member, telephone: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Direccion"
                    name="adress"
                    required
                    onChange={(e) =>
                      setMember({ ...member, address: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <TextField
                      fullWidth
                      label="Sexo"
                      name="sexo"
                      select
                      onChange={(e) =>
                          setMember({ ...member, sexo: e.target.value })
                      }
                  >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                    </TextField>
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Iglesia"
                    name="churchs"
                    required
                    select
                    onChange={(e) =>
                      setMember({ ...member, churchId: e.target.value })
                    }
                    value={member.churchId}
                  >
                    {Churchs.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Estado Civil"
                    name="stateCivil"
                    required
                    select
                    onChange={(e) =>
                      setMember({ ...member, maritalStatus: e.target.value })
                    }
                    value={member.maritalStatus}
                  >
                    {stateCivil.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Estado Iglesia"
                    name="stateChurch"
                    required
                    select
                    onChange={(e) =>
                      setMember({ ...member, statusId: e.target.value })
                    }
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
            <Button type="submit" variant="contained">Guardar</Button>
          </CardActions>
        </Card>
      </form>
  </>
  );
};
