import { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { CHANGE_PASSWORD } from "../../services/mutation";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

export const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirm: "",
  });
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const { id } = JSON.parse(window.sessionStorage.getItem("user"));

  const auth = useAuth();
  const router = useRouter();
  const handleSignOut = useCallback(() => {
    auth.signOut();
    router.push("/auth/login");
  }, [auth, router]);

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (values.password !== values.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    changePassword({ variables: { id: id, password: values.password } })
        .then(() => {
          handleSignOut();
        })
        .catch((error) => {
          console.error("Error changing password:", error);
        });
  }, [values, changePassword, id, handleSignOut]);

  return (
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader="Actualizar contraseña" title="Contraseña" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 400 }}>
              <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={values.password}
              />
              <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  name="confirm"
                  onChange={handleChange}
                  type="password"
                  value={values.confirm}
              />
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
                variant="contained"
                type="submit"
            >
              Actualizar
            </Button>
          </CardActions>
        </Card>
      </form>
  );
};
