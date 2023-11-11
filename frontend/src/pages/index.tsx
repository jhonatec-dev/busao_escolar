import LoginSkeleton from "@/components/Login/LoginSkeleton";
import Logo from "@/components/Logo";
import { AppContext } from "@/context/app.provider";
import { saveToLS } from "@/utils/localStorage";
import {
  DarkMode,
  LightMode,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Button, Card, IconButton, Stack, TextField } from "@mui/material";
import Head from "next/head";
import { useContext, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import validator from "validator";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classNameImg, setClassNameImg] = useState("");
  const [loading, setLoading] = useState(false);
  const { showMessage, getData, login, toggleMode, themeMode } =
    useContext(AppContext);
  const { width } = useWindowSize();

  const validateForm = () => {
    if (!email || !password) return false;
    if (password.length < 6) return false;
    return validator.isEmail(email);
  };

  const handleClickLogin = async () => {
    if (!validateForm()) {
      showMessage("Email ou senha inválidos", "error");
      return;
    }
    try {
      setLoading(true);
      const data = await getData("login", "post", {
        email,
        password,
      });
      if (data && data.token) {
        setClassNameImg("move-to-right");
        saveToLS("tokenBusaoEscolar", data.token);
        login();
      }
    } catch (error: any) {
      showMessage(error.message, "error");
    }
    setLoading(false);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleClickLogin();
    }
  };

  return (
    <>
      <Head>
        <title>Bem vindo ao Busão Escolar</title>
        <meta
          name="description"
          content="Registre sua vaga no ônibus escolar"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}
      >
        <Card className="Card" variant={width < 600 ? "elevation" : "outlined"}>
          <Stack spacing={2} alignItems={"center"}>
            <Logo size={100} className={classNameImg} />
            {loading ? (
              <LoginSkeleton />
            ) : (
              <>
                <TextField
                  label="E-mail"
                  variant="filled"
                  fullWidth
                  inputProps={{ type: "email" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label="Senha"
                  variant="filled"
                  fullWidth
                  value={password}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setPassword(e.target.value)}
                  inputProps={{ type: showPassword ? "text" : "password" }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleClickLogin}
                  fullWidth
                >
                  Entrar
                </Button>
                <IconButton onClick={toggleMode} size="large">
                  {themeMode === "light" ? (
                    <DarkMode fontSize="inherit" />
                  ) : (
                    <LightMode fontSize="inherit" />
                  )}
                </IconButton>
                <Stack
                  direction={"row"}
                  pt={4}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Button
                    onClick={() => showMessage("Em desenvolvimento", "info")}
                    sx={{ textTransform: "none" }}
                  >
                    Esqueci minha senha
                  </Button>
                  <Button href="/register" size="large">
                    Registrar
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
