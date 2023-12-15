import Logo from "@/components/Logo";
import { AppContext } from "@/context/app.provider";
import {
  Button,
  ButtonGroup,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import validator from "validator";

export default function Home() {
  const [email, setEmail] = useState("");
  const { showMessage, getData } = useContext(AppContext);
  const router = useRouter();
  const { width } = useWindowSize();

  const validateForm = () => {
    return validator.isEmail(email);
  };

  const handleClickLogin = async () => {
    if (!validateForm()) {
      showMessage("Email inválido", "error");
      return;
    }
    try {
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Recuperar senha do Busão Escolar</title>
      </Head>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}
      >
        <Card className="Card" variant={width < 600 ? "elevation" : "outlined"}>
          <Stack spacing={2} alignItems={"center"}>
            <Logo size={100} />
            <>
              <Typography variant="h6">
                Digite o E-mail cadastrado no sistema
              </Typography>
              <TextField
                label="E-mail"
                variant="filled"
                fullWidth
                inputProps={{ type: "email" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <ButtonGroup>
                <Button variant="outlined" size="large" onClick={handleGoBack}>
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleClickLogin}
                >
                  Recuperar Senha
                </Button>
              </ButtonGroup>
            </>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
