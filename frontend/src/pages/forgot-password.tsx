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
import { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import validator from "validator";

export default function Home() {
  const [email, setEmail] = useState("");
  const { showMessage, getData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const response = await getData("student/forgot", "post", {
        email,
      });
      console.log(response);
    } catch (error) {
      if (AxiosError) {
        console.log((error as AxiosError).response?.data);
      }
      showMessage((error as Error).message, "error");
      setLoading(false);
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
        <Card
          className='Card'
          elevation={width < 600 ? 0 : 2}
          variant={width < 600 ? "elevation" : "outlined"}
        >
          <Stack spacing={2} alignItems={"center"}>
            <Logo size={100} />
            {loading ? (
              <>
                <Typography variant='body1'>
                  Se o E-mail <strong>{email}</strong> estiver correto, você
                  receberá uma mensagem informando os próximos passos a serem
                  seguidos.
                </Typography>
                <Typography variant='body1'>
                  Obrigado por usar o Busão Escolar.
                </Typography>
                <Button onClick={handleGoBack} fullWidth variant='outlined'>
                  Voltar
                </Button>
              </>
            ) : (
              <>
                <Typography variant='h6'>
                  Digite o E-mail cadastrado no sistema
                </Typography>
                <TextField
                  label='E-mail'
                  variant='filled'
                  fullWidth
                  inputProps={{ type: "email" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <ButtonGroup>
                  <Button
                    variant='outlined'
                    size='large'
                    onClick={handleGoBack}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant='contained'
                    size='large'
                    onClick={handleClickLogin}
                  >
                    Recuperar Senha
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
