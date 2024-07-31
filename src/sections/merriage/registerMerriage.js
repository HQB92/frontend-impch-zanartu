import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardActions, CardContent, Divider, TextField, Grid
} from '@mui/material';
import { validateRut, formatRut, RutFormat } from '@fdograph/rut-utilities';
import { CREATE_MERRIAGE } from "../../services/mutation";
import { useMutation } from "@apollo/client";
import { Loader } from "react-feather";
import { Alert } from "@mui/lab";
import { useRouter } from "next/router";

const RegisterMerriage = () => {
  const initialState = {
    husbandId: '',
    fullNameHusband: '',
    wifeId: '',
    fullNameWife: '',
    civilCode: '',
    civilDate: '',
    civilPlace: '',
    religiousDate: ''
  };

  const [merriage, setMerriage] = useState(initialState);
  const [createMerriage, { data, loading, error }] = useMutation(CREATE_MERRIAGE);
  const router = useRouter();

  useEffect(() => {
    formatRUTField('husbandId');
    formatRUTField('wifeId');
  }, [merriage.husbandId, merriage.wifeId]);

  useEffect(() => {
    if (data) {
      setTimeout(() => router.push('/merriage'), 3000);
    }
  }, [data, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const fieldsToUppercase = ['fullNameHusband', 'fullNameWife', 'civilPlace', '']; // Campos para aplicar mayúsculas
    const isNumberField = name === 'civilCode';

    let newValue = value;
    if (fieldsToUppercase.includes(name)) {
      newValue = handleUppercase(value);
    } else if (isNumberField && value !== '') {
      newValue = parseInt(value);
    }

    setMerriage(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const formatRUTField = (field) => {
    if (validateRut(merriage[field])) {
      setMerriage(prev => ({
        ...prev,
        [field]: formatRut(merriage[field], RutFormat.DOTS_DASH)
      }));
    }
  };

  const handleUppercase = (data) => {
    return data.toLowerCase().replace(/(^|\s)([a-zñ])/g, (match) => match.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!merriage.civilDate || !merriage.religiousDate) {
      alert('Por favor, completa todas las fechas requeridas.');
      return;
    }
    createMerriage({
      variables: { merriageRecord: { ...merriage } }
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
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="RUT Esposo"
                        name="husbandId"
                        value={merriage.husbandId}
                        onChange={handleChange}
                        helperText={merriage.husbandId.length >= 7 && (!validateRut(merriage.husbandId) && "Rut inválido")}
                        error={merriage.husbandId.length >= 7 && (!validateRut(merriage.husbandId))}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Nombre Completo del Esposo"
                        name="fullNameHusband"
                        onChange={handleChange}
                        value={merriage.fullNameHusband}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Rut de la Esposa"
                        name="wifeId"
                        onChange={handleChange}
                        value={merriage.wifeId}
                        helperText={merriage.wifeId.length >= 7 && (!validateRut(merriage.wifeId) && "Rut inválido")}
                        error={merriage.wifeId.length >= 7 && (!validateRut(merriage.wifeId))}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Nombre Completo de la Madre"
                        name="fullNameWife"
                        onChange={handleChange}
                        value={merriage.fullNameWife}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Número de Registro"
                        name="civilCode"
                        type={"number"}
                        onChange={handleChange}
                        value={merriage.civilCode}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Lugar de Registro"
                        name="civilPlace"
                        onChange={handleChange}
                        value={merriage.civilPlace}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Fecha de Matrimonio Civil"
                        name="civilDate"
                        type="date"
                        onChange={handleChange}
                        value={merriage.civilDate || ''}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Fecha de Matrimonio Religioso"
                        name="religiousDate"
                        type="date"
                        onChange={handleChange}
                        value={merriage.religiousDate || ''}
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

export default RegisterMerriage;
