import { AppContext } from "@/context/appProvider";
import { DarkMode, Edit, ExitToApp, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";

export default function Header() {
  const { profile, logout, toggleMode, themeMode } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ top: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Olá, {profile?.name}</Typography>
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
            <MenuItem
              onClick={() => {
                toggleMode();
                handleClose();
              }}
            >
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
    </>
  );
}
