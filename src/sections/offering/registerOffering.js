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
} from '@mui/material';
import { CREATE_OFFERING } from '../../services/mutation';
import { useMutation } from '@apollo/client';
import { Loader } from 'react-feather';
import { Alert } from '@mui/lab';
import { useRouter } from 'next/router';
import { useChurch } from '../../hooks/useChurch';
import {useUser} from "../../hooks/useUser";

export const RegisterOffering = (props) => {
  const church = useChurch();
  const user = useUser();
  const initialState = {
    amount: '',
    date: '',
    type: '',
    churchId: '',
    userId: '',
    state: '',
  };
  const [offering, setOffering] = useState(initialState);
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const [createOffering, { data, loading, error }] = useMutation(CREATE_OFFERING);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push('/offering');
      }, 3000);
    }
  }, [data]);

  useEffect(() => {
    if (triggerSubmit) {
      createOffering({
        variables: {
          offering: {
            ...offering,
            amount: parseInt(offering.amount, 10),
          },
        },
      });
      setTriggerSubmit(false);
    }
  }, [triggerSubmit, offering, createOffering]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOffering((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOffering((prev) => ({
      ...prev,
      churchId: parseInt(church),
      userId: user.id,
      state: true,
    }));
    setTriggerSubmit(true);
  };

  if (loading) return <Loader />;
  if (data) return <Alert severity="success">Ofrenda Registrada Exitosamente</Alert>;
  if (error) return <Alert severity="error">Error al registrar Ofrenda</Alert>;

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
                    label="Monto"
                    name="amount"
                    type="number"
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Fecha"
                    name="date"
                    type="date"
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Tipo"
                    name="type"
                    select
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Ofrenda">Ofrenda</MenuItem>
                    <MenuItem value="Donación">Donación</MenuItem>
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
