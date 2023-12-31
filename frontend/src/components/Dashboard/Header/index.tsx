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
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function Header() {
  const { profile, logout, toggleMode, themeMode, showMessage } =
    useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const trigger = useScrollTrigger();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfileClick = () => {
    showMessage("Funcionalidade em desenvolvimento", "warning");
    handleClose();
  };

  return (
    <Slide direction="down" in={!trigger}  appear={false}>
      <AppBar elevation={0} sx={{boxShadow: "0px 0px 4px rgba(255, 255, 255, 0.2)" }}>
        <Toolbar sx={{ justifyContent: "space-between", padding: 1.3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              src="/logo192.png"
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
            <MenuItem onClick={handleEditProfileClick}>
              <Edit sx={{ mr: 1 }} /> Editar minha conta
            </MenuItem>

            <MenuItem onClick={() => router.push("/terms")}>
              <Assignment sx={{ mr: 1 }} /> Termos de Uso
            </MenuItem>
            <Divider />
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
            <Divider />
            <MenuItem onClick={logout}>
              <ExitToApp sx={{ mr: 1 }} /> Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
