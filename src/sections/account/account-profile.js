import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const user = {
  avatar: "/assets/avatars/avatar-cao-yu.png",
  city: "Chile",
  country: "Chillán",
  timezone: "GTM-4",
};

export const AccountProfile = () => {
    const profile = JSON.parse(window.sessionStorage.getItem("profile"));

    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
            />
            <Typography gutterBottom variant="h6">
              {profile?.names} {profile?.lastNameDad} {profile?.lastNameMom}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.city}, {user.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.timezone}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button fullWidth variant="text" disabled={true}>
            Cambiar Foto de Perfil
          </Button>
        </CardActions>
      </Card>
    );
}
