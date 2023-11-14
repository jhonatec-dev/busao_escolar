import { AppContext } from "@/context/app.provider";
import { ITravel } from "@/interfaces/ITravel";
import { Close } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { useContext } from "react";
import DialogAdmin from "./admin";
import DialogStudent from "./student";

export interface ITravelDialogProps {
  date: Dayjs;
  handleClose: () => void;
  travel: ITravel;
}

export default function TravelDialog(props: ITravelDialogProps) {
  const { handleClose, date } = props;
  const { studentView, setStudentView, profile } = useContext(AppContext);
  return (
    <Stack p={2} spacing={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        alignItems={"center"}
      >
        <Typography variant="h6">
          {date.format("dddd").split("-")[0].toUpperCase()} -{" "}
          {date.format("DD/MM/YYYY")}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Stack>
      {profile.role === "admin" && (
        <>
          <Divider />
          <Typography variant="h6">
            Interagindo com o calendário como:
          </Typography>
          <ToggleButtonGroup
            value={studentView}
            sx={{ justifyContent: "center" }}
            color="primary"
            exclusive
          >
            <ToggleButton
              value="true"
              selected={studentView}
              onClick={() => setStudentView(true)}
            >
              Aluno
            </ToggleButton>
            <ToggleButton
              value="false"
              selected={!studentView}
              onClick={() => setStudentView(false)}
            >
              Administrador
            </ToggleButton>
          </ToggleButtonGroup>
          <Divider />
        </>
      )}
      {studentView ? <DialogStudent {...props} /> : <DialogAdmin {...props} />}
    </Stack>
  );
}
