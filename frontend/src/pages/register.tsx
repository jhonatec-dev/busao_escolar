import { IStudent } from "@/interfaces/IStudent";
import {
  CalendarMonth,
  ExpandLess,
  ExpandMore,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import validator from "validator";

import Logo from "@/components/Logo";
import { AppContext } from "@/context/app.provider";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IStudent>();
  const [showPassword, setShowPassword] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const { showMessage, getData } = useContext(AppContext);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<IStudent> = async (data) => {
    try {
      setLoading(true);
      const response = await getData(`student`, "post", data);
      if (response) {
        showMessage("Conta criada com sucesso", "success");
        reset();
        setCreated(true);
      }
    } catch (error: any) {
      // console.log(error);
      showMessage(error.message, "error");
      setCreated(false);
      reset();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Stack alignItems={"center"} justifyContent={"center"} height={"100vh"}>
        <Card className="Card" variant="outlined">
          <Stack spacing={2} p={2} alignItems={"center"} textAlign={"center"}>
            <Logo size={100} />
            <Typography variant="h5">Criando conta...</Typography>
            <CircularProgress />
          </Stack>
        </Card>
      </Stack>
    );
  }

  if (created) {
    return (
      <Stack alignItems={"center"} justifyContent={"center"} height={"100vh"}>
        <Card className="Card" variant="outlined">
          <Stack spacing={2} p={2} alignItems={"center"} textAlign={"center"}>
            <Logo size={100} />
            <Typography variant="h5">Conta criada com sucesso!</Typography>
            <Typography variant="body1">
              Enviamos para seu E-mail a confirmação do cadastro.
            </Typography>
            <Typography variant="body1">
              Aguarde o administrador aprovar o cadastro.
            </Typography>
            <Typography variant="body1">
              Você receberá um E-mail quando seu cadastro estiver aprovado.
            </Typography>
            <Button variant="contained" fullWidth href="/">
              Voltar
            </Button>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack alignItems={"center"} justifyContent={"center"} minHeight={"100vh"}>
      <Card className="Card" variant="outlined">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} textAlign={"center"}>
            <Logo size={100} />
            <Typography variant="h6">Crie sua conta</Typography>
            <Divider sx={{ width: "100%" }}>Dados do aluno</Divider>
            <TextField
              label="Nome"
              variant="filled"
              fullWidth
              {...register("name", {
                required: "Nome obrigatório",
                minLength: {
                  value: 3,
                  message: "Nome deve ter pelo menos 3 digitos",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Escola / Faculdade"
              variant="filled"
              fullWidth
              {...register("school", {
                required: "Escola / Faculdade obrigatória",
                minLength: {
                  value: 3,
                  message: "Deve ter pelo menos 3 digitos",
                },
              })}
              error={!!errors.school}
              helperText={errors.school?.message}
            />
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              startIcon={<CalendarMonth />}
              endIcon={showFrequency ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowFrequency(!showFrequency)}
            >
              Frequência
            </Button>
            <Collapse in={showFrequency}>
              <Typography variant="body1" mt={1}>
                Marque os dias da semana que precisa de uma vaga reservada.
              </Typography>
              <Typography variant="body2" mt={1} mb={2}>
                Se seu curso não for presencial, deixe em branco.
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox {...register("frequency.monday")} />}
                  label="Segunda"
                />
                <FormControlLabel
                  control={<Checkbox {...register("frequency.tuesday")} />}
                  label="Terça"
                />
                <FormControlLabel
                  control={<Checkbox {...register("frequency.wednesday")} />}
                  label="Quarta"
                />
                <FormControlLabel
                  control={<Checkbox {...register("frequency.thursday")} />}
                  label="Quinta"
                />
                <FormControlLabel
                  control={<Checkbox {...register("frequency.friday")} />}
                  label="Sexta"
                />
                <FormControlLabel
                  control={<Checkbox {...register("frequency.saturday")} />}
                  label="Sábado"
                />
                <FormControlLabel
                  control={<Checkbox {...register("frequency.sunday")} />}
                  label="Domingo"
                />
              </FormGroup>
            </Collapse>
            <Divider sx={{ width: "100%" }}>Dados de acesso</Divider>
            <TextField
              label="E-mail"
              variant="filled"
              fullWidth
              // inputProps={{ type: "email" }}
              {...register("email", {
                required: "Email obrigatório",
                validate: (value) => {
                  if (!validator.isEmail(value)) {
                    return "Email inválido";
                  }
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Senha"
              variant="filled"
              fullWidth
              {...register("password", {
                required: "Senha obrigatória",
                minLength: {
                  value: 6,
                  message: "Senha deve ter pelo menos 6 digitos",
                },
              })}
              inputProps={{ type: showPassword ? "text" : "password" }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirme sua senha"
              variant="filled"
              fullWidth
              {...register("confirmPassword", {
                required: "Confirme sua senha",
                validate: (value) => {
                  if (value !== watch("password")) {
                    return "As senhas devem ser iguais";
                  }
                },
              })}
              inputProps={{ type: showPassword ? "text" : "password" }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button variant="contained" size="large" type="submit">
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
