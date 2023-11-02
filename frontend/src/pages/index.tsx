import { AppContext } from "@/context/appProvider";
import { saveToLS } from "@/utils/localStorage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import axios, { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import validator from "validator";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showMessage } = useContext(AppContext);
  const router = useRouter();

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
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.token) {
        saveToLS("token", response.data.token);
        router.push("/dashboard");
      }
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        showMessage(error.response?.data.message, "error");
      } else showMessage(error.message, "error");
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
      <Stack alignItems={"center"} justifyContent={"center"} height={"100vh"}>
        <Card className="Card" variant="outlined">
          <Stack spacing={2} p={2}>
            <Typography variant="h4">Busão Escolar</Typography>
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
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ type: showPassword ? "text" : "password" }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button variant="contained" size="large" onClick={handleClickLogin}>
              Entrar
            </Button>
            <Stack direction={"row"} pt={4} justifyContent={"space-between"}>
              <Button onClick={() => showMessage("Em desenvolvimento", "info")} sx={{ textTransform: "none" }}>
                Esqueci minha senha
              </Button>
              <Button href="/register" size="large">
                Registrar
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
