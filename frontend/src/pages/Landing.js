import {  Button, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LandingBg from "../img/landingBg.jpg";
import { useAuth0 } from "@auth0/auth0-react";
function Landing() {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect({
            returnTo: window.location.origin,
        });
    };

    return (
        <div
            style={{
                backgroundSize: "100%",
                height: "calc(100vh - 64px)",
                opacity: "0.9",
                backgroundImage: `url(${LandingBg})`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "220px",
            }}
        >
            <Typography
                variant="h2"
                component="div"
                color="white"
                sx={{ opacity: "1", textShadow: "3px 3px 0px black" }}
            >
                Welcome to DailyStyle
            </Typography>
            <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                color="#D5D5D5"
                sx={{ opacity: "1", textShadow: "3px 3px 0px black" }}
            >
                Fashion is like eating. You shoudn't stick with the same menu. —
                Kenzo Takada
            </Typography>
            <Button
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{ marginTop: "40px" }}
                onClick={handleLogin}
            >
                Login
            </Button>
        </div>
    );
}

export default Landing;
