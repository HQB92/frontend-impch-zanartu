import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TextField, Grid
} from '@mui/material';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';
import { CREATE_BAPTISM } from "../../services/mutation";
import { useMutation } from "@apollo/client";
import { Loader } from "react-feather";
import { Alert } from "@mui/lab";
import { useRouter } from "next/router";

export const RegisterBaptism = () => {
  const initialState = {
    childRUT: '',
    childFullName: '',
    childDateOfBirth: '',
    fatherRUT: '',
    fatherFullName: '',
    motherRUT: '',
    motherFullName: '',
    placeOfRegistration: '',
    baptismDate: '',
    registrationNumber: '',
    registrationDate: '',
  };

  const [baptism, setBaptism] = useState(initialState);
  const [createBaptism, { data, loading, error }] = useMutation(CREATE_BAPTISM);
  const router = useRouter();

  useEffect(() => {
    formatRUTField('childRUT');
    formatRUTField('fatherRUT');
    formatRUTField('motherRUT');
  }, [baptism.childRUT, baptism.fatherRUT, baptism.motherRUT]);

  useEffect(() => {
    if (data) {
      setTimeout(() => router.push('/baptism'), 3000);
    }
  }, [data, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const fieldsToUppercase = ['childFullName', 'fatherFullName', 'motherFullName', 'placeOfRegistration']; // Campos para aplicar mayúsculas
    const isNumberField = name === 'registrationNumber'; // Verificar si el campo es el número de registro

    let newValue = value;
    if (fieldsToUppercase.includes(name)) {
      newValue = handleUppercase(value);
    } else if (isNumberField && value !== '') {
      newValue = value.replace(/[^0-9]/g, ''); // Aceptar solo números
    }

    setBaptism(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const formatRUTField = (field) => {
    if (validateRut(baptism[field])) {
      setBaptism(prev => ({
        ...prev,
        [field]: formatRut(baptism[field], RutFormat.DOTS_DASH)
      }));
    }
  };

  const handleUppercase = (data) => {
    return data.toLowerCase().replace(/(^|\s)([a-zñ])/g, (match) => match.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegúrate de que las fechas no estén vacías
    if (!baptism.childDateOfBirth || !baptism.baptismDate || !baptism.registrationDate) {
      alert('Por favor, completa todas las fechas requeridas.');
      return;
    }
    createBaptism({
      variables: { baptismRecord: { ...baptism } }
    });
  };

  if (loading) return <Loader />;
  if (data) return <Alert severity="success">{"Bautizo Registrado Exitosamente"}</Alert>;
  if (error) return <Alert severity="error">{"Error al registrar Bautizo"}</Alert>;

  return (
      <>
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Rut Niño"
                        name="childRUT"
                        value={baptism.childRUT}
                        onChange={handleChange}
                        helperText={baptism.childRUT.length >= 7 && (!validateRut(baptism.childRUT) && "Rut inválido")}
                        error={baptism.childRUT.length >= 7 && (!validateRut(baptism.childRUT))}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        label="Nombre Completo del Niño"
                        name="childFullName"
                        onChange={handleChange}
                        value={baptism.childFullName}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Fecha de Nacimiento del Niño"
                        name="childDateOfBirth"
                        type="date"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Rut del Padre"
                        name="fatherRUT"
                        onChange={handleChange}
                        value={baptism.fatherRUT}
                        helperText={baptism.fatherRUT.length >= 7 && (!validateRut(baptism.fatherRUT) && "Rut inválido")}
                        error={baptism.fatherRUT.length >= 7 && (!validateRut(baptism.fatherRUT))}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        label="Nombre Completo del Padre"
                        name="fatherFullName"
                        onChange={handleChange}
                        value={baptism.fatherFullName}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Rut de la Madre"
                        name="motherRUT"
                        onChange={handleChange}
                        value={baptism.motherRUT}
                        helperText={baptism.motherRUT.length >= 7 && (!validateRut(baptism.motherRUT) && "Rut inválido")}
                        error={baptism.motherRUT.length >= 7 && (!validateRut(baptism.motherRUT))}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        label="Nombre Completo de la Madre"
                        name="motherFullName"
                        onChange={handleChange}
                        value={baptism.motherFullName}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Lugar de Registro"
                        name="placeOfRegistration"
                        onChange={handleChange}
                        value={baptism.placeOfRegistration}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Fecha de Registro"
                        name="registrationDate"
                        type="date"
                        onChange={handleChange}
                        value={baptism.registrationDate || ''}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Número de Registro"
                        name="registrationNumber"
                        type={"number"}
                        onChange={handleChange}
                        value={baptism.registrationNumber}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Fecha de Bautizo"
                        name="baptismDate"
                        type="date"
                        onChange={handleChange}
                        value={baptism.baptismDate || ''}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
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
