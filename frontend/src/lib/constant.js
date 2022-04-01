import { createTheme } from "@mui/material";
import { indigo } from "@mui/material/colors";

export const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
export const baseUrl = isDevelopment
  ? process.env.REACT_APP_LOCAL_BASE_URL
  : process.env.REACT_APP_PRODUCTION_BASE_URL;
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#454545",
    }
  },
});
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#357a38"
    },
    secondary: {
      main: "#ffffff",
    }
  },
});
