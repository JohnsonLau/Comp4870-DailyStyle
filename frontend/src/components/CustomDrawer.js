import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import HomeIcon from "@mui/icons-material/Home";
import { styled } from "@mui/material/styles";
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from "react";
import Favorite from "@mui/icons-material/Favorite";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ViewListIcon from "@mui/icons-material/ViewList";
import { darkTheme, lightTheme } from "../lib/constant";

export default function CustomDrawer({setTheme}) {
  const { logout, loginWithRedirect, isAuthenticated } = useAuth0();

  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    loginWithRedirect({
      returnTo: window.location.origin,
    });
  };

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  const handleToggleTheme = () => {
    setTheme(prev=>{
      return prev.palette.mode === "light" ? darkTheme : lightTheme;
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              size="large"
              edge="start"
              color="secondary"
              aria-label="menu"
              onClick={() => {
                setOpen(true);
              }}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Daily Style
          </Typography>
          <FormControlLabel
            control={<MaterialUISwitch sx={{ m: 1 }} />}
            label=""
            onChange={(e) => {
              handleToggleTheme();
            }}
          />
          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="secondary"
                onClick={handleLogout}
              >
                <LogoutIcon />
              </IconButton>
            </div>
          ) : (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="secondary"
                onClick={handleLogin}
              >
                <LoginIcon />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <CustomList setOpen={setOpen} />
      </Drawer>
    </Box>
  );
}

const CustomList = ({ setOpen }) => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };
  const handleFavorites = () => {
    navigate("/Favourites");
  };
  const handleAdd = () => {
    navigate("/AddClothes");
  };
  const handleList = () => {
    navigate("/ListClothes");
  };

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => {
        setOpen(false);
      }}
    >
      <Toolbar>Daily Style</Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={handleHome}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>

        <ListItem button onClick={handleFavorites}>
          <ListItemIcon>
            <Favorite />
          </ListItemIcon>
          <ListItemText primary={"Favorite"} />
        </ListItem>

        <ListItem button onClick={handleAdd}>
          <ListItemIcon>
            <LibraryAddIcon />
          </ListItemIcon>
          <ListItemText primary={"Add New Clothes"} />
        </ListItem>

        <ListItem button onClick={handleList}>
          <ListItemIcon>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary={"List of Clothes"} />
        </ListItem>
      </List>
    </Box>
  );
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
