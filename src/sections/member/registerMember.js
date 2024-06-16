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
import { set } from 'nprogress';

export const RegisterMember = (props) => {
  const [values, setValues] = useState({
    fechaNacimiento: false,
    fechaProbando: false,
    fechaPlenaComunion: false,
  });
  const [member, setMember] = useState({
    rut: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    fechaProbando: '',
    fechaPlenaComunion: '',
    email: '',
    telefonoCelular: '',
    telefonoFijo: '',
    direccion: '',
    ciudad: '',
    pais: 'Chile',
    iglesia: 1,
    estadoCivil: 1,
    estadoIglesia: 1,
  });
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

  return (
    <form autoComplete="off" noValidate>
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
                  error={validateRut(member.rut) ? false : true}
                  required
                  disabled={!props ? true : false}
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
                      nombre: handleUpercase(e.target.value),
                    })
                  }
                  value={member.nombre}
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
                      apellidoPaterno: handleUpercase(e.target.value),
                    })
                  }
                  required
                  value={member.apellidoPaterno}
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
                      apellidoMaterno: handleUpercase(e.target.value),
                    })
                  }
                  value={member.apellidoMaterno}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  name="birthday"
                  label="Fecha de Nacimiento"
                  onFocus={() => {
                    setValues({ ...values, fechaNacimiento: true });
                  }}
                  onBlur={() => {
                    setValues({ ...values, fechaNacimiento: false });
                  }}
                  type={values.fechaNacimiento ? 'date' : 'text'}
                  required
                  onChange={(e) =>
                    setMember({ ...member, fechaNacimiento: e.target.value })
                  }
                />
              </Grid>
              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  name="probando"
                  label="Fecha Miembro Probando"
                  onFocus={() => {
                    setValues({ ...values, fechaProbando: true });
                  }}
                  onBlur={() => {
                    setValues({ ...values, fechaProbando: false });
                  }}
                  type={values.fechaProbando ? 'date' : 'text'}
                  onChange={(e) =>
                    setMember({ ...member, fechaProbando: e.target.value })
                  }
                />
              </Grid>
              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  name="plenaComunion"
                  label="Fecha Plena comunión"
                  onFocus={() => {
                    setValues({ ...values, fechaPlenaComunion: true });
                  }}
                  onBlur={() => {
                    setValues({ ...values, fechaPlenaComunion: false });
                  }}
                  type={values.fechaPlenaComunion ? 'date' : 'text'}
                  onChange={(e) =>
                    setMember({ ...member, fechaPlenaComunion: e.target.value })
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
                    member.telefonoCelula !== '' ||
                    1 < member.telefonoFijo.length < 9
                      ? true
                      : false
                  }
                  helperText={
                    member.telefonoCelular.length === 9
                      ? 'Telefono Correcto'
                      : 'Telefono Incorrecto'
                  }
                  onChange={(e) =>
                    setMember({ ...member, telefonoCelular: e.target.value })
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
                    setMember({ ...member, telefonoFijo: e.target.value })
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
                    setMember({ ...member, direccion: e.target.value })
                  }
                />
              </Grid>
              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  name="country"
                  required
                  onChange={(e) =>
                    e.target.value.length === 1
                      ? setMember({
                          ...member,
                          ciudad: e.target.value.toUpperCase(),
                        })
                      : setMember({ ...member, ciudad: e.target.value })
                  }
                />
              </Grid>
              <Grid xs={12} md={2}>
                <div>
                  <TextField
                    fullWidth
                    label="Pais"
                    name="state"
                    required
                    select
                    onChange={(e) =>
                      setMember({ ...member, pais: e.target.value })
                    }
                    value={member.pais}
                  >
                    {states.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Grid>
              <Grid xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Iglesia"
                  name="churchs"
                  required
                  select
                  onChange={(e) =>
                    setMember({ ...member, iglesia: e.target.value })
                  }
                  value={member.iglesia}
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
                    setMember({ ...member, estadoCivil: e.target.value })
                  }
                  value={member.estadoCivil}
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
                    setMember({ ...member, estadoIglesia: e.target.value })
                  }
                  value={member.estadoIglesia}
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
          <Button variant="contained">Guardar</Button>
        </CardActions>
      </Card>
    </form>
  );
};
