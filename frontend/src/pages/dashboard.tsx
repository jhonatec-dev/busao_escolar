import { AppContext } from "@/context/appProvider";
import { IStudent } from "@/interfaces/IStudent";
import { getFromLS } from "@/utils/localStorage";
import { DarkMode, Edit, ExitToApp, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<IStudent>({} as IStudent);
  const { showMessage, logout, toggleMode, themeMode } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const token = getFromLS("token");
    if (!token) {
      router.push("/");
    }
    const getUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data)
        setProfile(response.data);
      } catch (error: AxiosError | any) {
        // console.log('Error', error)
        if (error instanceof AxiosError) {
          showMessage(error.response?.data.message, "error");
        } else showMessage(error.message, "error");

        router.push("/");
      }
    };

    getUserProfile();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ top: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Olá, {profile.name}</Typography>
          <IconButton onClick={handleMenu}>
            <Avatar />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Edit sx={{ mr: 1 }} /> Editar minha conta
            </MenuItem>
            <MenuItem onClick={logout}>
              <ExitToApp sx={{ mr: 1 }} /> Sair
            </MenuItem>
            <MenuItem onClick={toggleMode}>
              {themeMode === "light" ? (
                <DarkMode sx={{ mr: 1 }} />
              ) : (
                <LightMode sx={{ mr: 1 }} />
              )}
              {themeMode === "light" ? "Modo escuro" : "Modo claro"}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
