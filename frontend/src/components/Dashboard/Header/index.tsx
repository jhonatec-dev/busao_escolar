import { AppContext } from "@/context/app.provider";
import {
  Assignment,
  DarkMode,
  Edit,
  ExitToApp,
  LightMode,
  MenuSharp,
} from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function Header() {
  const { profile, logout, toggleMode, themeMode } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: "space-between", padding: 1.3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              src="/assets/images/bus.svg"
              alt="logo"
              width={50}
              height={50}
            />
            <Typography variant="h6">{profile?.name}</Typography>
          </Stack>
          <Tooltip title="Abrir menu">
            <IconButton onClick={handleMenu} size="large" color="inherit">
              <MenuSharp fontSize="inherit" />
            </IconButton>
          </Tooltip>
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
            <MenuItem onClick={() => router.push("/terms")}>
              <Assignment sx={{ mr: 1 }} /> Termos de Uso
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
