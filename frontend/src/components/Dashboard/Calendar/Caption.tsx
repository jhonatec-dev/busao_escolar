import { AppContext } from "@/context/app.provider";
import { Badge, Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useContext } from "react";

interface ICaptionProps {
  editMode: boolean;
}

export default function Caption({ editMode }: ICaptionProps) {
  const { profile } = useContext(AppContext);

  if (!editMode && profile.role === "admin") {
    return (
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight="bold">
          Legenda
        </Typography>
        <Stack direction="row" justifyContent="space-around">
          <Stack
            spacing={1}
            alignItems={"center"}
            width={"70px"}
            textAlign={"center"}
          >
            <Badge
              color="primary"
              badgeContent=""
              variant="dot"
              overlap="circular"
            >
              <Box className="Day">{dayjs().date()}</Box>
            </Badge>
            <Typography variant="caption">Viagem agendada</Typography>
          </Stack>
          <Stack
            spacing={1}
            alignItems={"center"}
            width={"70px"}
            textAlign={"center"}
          >
            <Badge
              color="warning"
              badgeContent=""
              variant="dot"
              overlap="circular"
            >
              <Box className="Day">{dayjs().date()}</Box>
            </Badge>
            <Typography variant="caption">Viagem com vagas pendentes</Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (editMode)
    return (
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight="bold">
          Legenda
        </Typography>
        <Stack direction="row" justifyContent="space-around">
          <Stack
            spacing={1}
            alignItems={"center"}
            width={"70px"}
            textAlign={"center"}
          >
            <Badge
              color="primary"
              badgeContent=""
              variant="dot"
              overlap="circular"
            >
              <Box className="Day">{dayjs().date()}</Box>
            </Badge>
            <Typography variant="caption">Viagem agendada</Typography>
          </Stack>
          <Stack
            spacing={1}
            alignItems={"center"}
            width={"70px"}
            textAlign={"center"}
          >
            <Badge
              color="success"
              badgeContent=""
              variant="dot"
              overlap="circular"
            >
              <Box className="Day">{dayjs().date()}</Box>
            </Badge>
            <Typography variant="caption">Viagem adicionada</Typography>
          </Stack>
          <Stack
            spacing={1}
            alignItems={"center"}
            width={"70px"}
            textAlign={"center"}
          >
            <Badge
              color="error"
              badgeContent=""
              variant="dot"
              overlap="circular"
            >
              <Box className="Day">{dayjs().date()}</Box>
            </Badge>
            <Typography variant="caption">Viagem cancelada</Typography>
          </Stack>
        </Stack>
      </Stack>
    );

  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight="bold">
        Legenda
      </Typography>
      <Stack direction="row" justifyContent="space-around">
        <Stack
          spacing={1}
          alignItems={"center"}
          width={"70px"}
          textAlign={"center"}
        >
          <Badge
            color="success"
            badgeContent=""
            variant="dot"
            overlap="circular"
          >
            <Box className="Day">{dayjs().date()}</Box>
          </Badge>
          <Typography variant="caption">Vaga confirmada</Typography>
        </Stack>
        <Stack
          spacing={1}
          alignItems={"center"}
          width={"70px"}
          textAlign={"center"}
        >
          <Badge
            color="warning"
            badgeContent=""
            variant="dot"
            overlap="circular"
          >
            <Box className="Day">{dayjs().date()}</Box>
          </Badge>
          <Typography variant="caption">Aguardando confirmação</Typography>
        </Stack>
        <Stack
          spacing={1}
          alignItems={"center"}
          width={"70px"}
          textAlign={"center"}
        >
          <Badge color="info" badgeContent="" variant="dot" overlap="circular">
            <Box className="Day">{dayjs().date()}</Box>
          </Badge>
          <Typography variant="caption">Disponível</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
