import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useQuery, gql} from "@apollo/client";

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
  console.log("rut", rut);
  const { data, error, loading } = useQuery(gql`
    query miProfile($rut: ID!) {
      Member {
        getByRut(rut: $rut) {
          names
          lastNameDad
          lastNameMom
          address
          email
          mobile
        }
      }
    }
  `, {
    variables: { rut: rut } // Utiliza "variables" en lugar de "variable"
  });
  const  profileSave = JSON.parse(window.sessionStorage.getItem("profile"));

  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
      if(data) {
        const profile = {
          rut: rut,
          names: data?.Member?.getByRut?.names,
          lastNameDad: data?.Member?.getByRut?.lastNameDad,
          lastNameMom: data?.Member?.getByRut?.lastNameMom,
          address: data?.Member.getByRut?.address,
          email: data?.Member?.getByRut?.email,
          mobile: data?.Member?.getByRut?.mobile
        }
        window.sessionStorage.setItem("profile", JSON.stringify(profile));
      }else{
        window.sessionStorage.setItem("profile", JSON.stringify({}));
      }

    },[pathname]
  );

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});
