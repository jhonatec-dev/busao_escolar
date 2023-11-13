import { Badge, Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function Caption() {
  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight="bold">Legenda</Typography>
      <Stack direction="row" justifyContent="space-evenly">
        <Stack spacing={2} alignItems={"center"}>
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
        <Stack spacing={2} alignItems={"center"}>
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
        <Stack spacing={2} alignItems={"center"}>
          <Badge color="info" badgeContent="" variant="dot" overlap="circular">
            <Box className="Day">{dayjs().date()}</Box>
          </Badge>
          <Typography variant="caption">Disponível</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
