import { createTheme as createMuiTheme } from "@mui/material";
import { createPalette } from "./create-palette";
import { createComponents } from "./create-components";
import { createShadows } from "./create-shadows";
import { createTypography } from "./create-typography";

export function createTheme() {
  const palette = createPalette();
  const components = createComponents({ palette });
  const shadows = createShadows();
  const typography = createTypography();

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 100,
        sm: 700,
        md: 1000,
        lg: 1300,
        xl: 1640,
      },
    },
    components,
    palette,
    shadows,
    shape: {
      borderRadius: 8,
    },
    typography,
  });
}
