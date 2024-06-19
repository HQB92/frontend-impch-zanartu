import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useLazyQuery, gql } from "@apollo/client";
import Loader from "../../components/loader";
import {GET_PROFILE} from "../../services/query";
import {Alert} from "@mui/lab";

const SIDE_NAV_WIDTH = 302;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});



export const Layout = withAuthGuard((props) => {
  const user = window.sessionStorage.getItem("user");
  const { rut } = JSON.parse(user) || {};
  const [miProfile, { data, error, loading }] = useLazyQuery(GET_PROFILE, {
    fetchPolicy: 'no-cache'
  });
  const profileSave = JSON.parse(window.sessionStorage.getItem("profile"));

  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(() => {
    handlePathnameChange();
  }, [pathname]);

  useEffect(() => {
    miProfile({ variables: { rut: rut } });
  }, [miProfile, rut]);

  useEffect(() => {
    if (data) {
      const profile = {
        rut: rut,
        names: data?.Member?.getByRut?.names,
        lastNameDad: data?.Member?.getByRut?.lastNameDad,
        lastNameMom: data?.Member?.getByRut?.lastNameMom,
        address: data?.Member?.getByRut?.address,
        email: data?.Member?.getByRut?.email,
        mobile: data?.Member?.getByRut?.mobile,
      };
      window.sessionStorage.setItem("profile", JSON.stringify(profile));
      console.log("profile", profile);
    } else if (error) {
      console.error("Error fetching profile:", error);
      window.sessionStorage.setItem("profile", JSON.stringify({}));
    }
  }, [data, error, rut]);

  if(loading) <Loader/>
  return (
      <>
        <TopNav onNavOpen={() => setOpenNav(true)} />
        <SideNav onClose={() => setOpenNav(false)} open={openNav} />
        <LayoutRoot>
          <LayoutContainer>{children}</LayoutContainer>
        </LayoutRoot>
        {error && <Alert severity="error">Error al cargar perfil</Alert>}
      </>
  );
});