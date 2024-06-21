import { useCallback, useState } from "react";
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
} from "@mui/material";

const states = [
  {
    value: "Chile",
    label: "Chile",
  },
];

export const AccountProfileDetails = () => {
  const profile = JSON.parse(window.sessionStorage.getItem("profile"));
  const [values, setValues] = useState({
    firstName: profile?.names,
    lastName: profile?.lastNameDad,
    email: profile?.email,
    phone: profile?.mobile,
    country: profile?.address,
    state: "Chillán",
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="La informacion que puedes editar" title="Mis Datos" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Por favor ingrese su nombre"
                  label="Nombre"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                  disabled={true}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido Pater"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                  disabled={true}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  disabled={true}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                  disabled={true}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  name="country"
                  onChange={handleChange}
                  required
                  disabled={true}
                  value={values.state}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pais"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.country}
                  disabled={true}
                >
                  {states.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" disabled={true}>Guardar</Button>
        </CardActions>
      </Card>
    </form>
  );
};
