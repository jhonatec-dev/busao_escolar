import { DataContext } from "@/context/data.provider";
import { ITravel } from "@/interfaces/ITravel";
import {
  Divider,
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
  const { asStudent, setAsStudent } = useContext(DataContext);
    return (
    <Stack p={2} spacing={2}>
      <Typography variant="h6">Interagindo com o calendário como:</Typography>
      <ToggleButtonGroup value={asStudent} sx={{ justifyContent: "center" }}>
        <ToggleButton
          value="true"
          selected={asStudent}
          onClick={() => setAsStudent(true)}
        >
          Aluno
        </ToggleButton>
        <ToggleButton
          value="false"
          selected={!asStudent}
          onClick={() => setAsStudent(false)}
        >
          Administrador
        </ToggleButton>
      </ToggleButtonGroup>
      <Divider />
      {asStudent ? <DialogStudent {...props} /> : <DialogAdmin {...props} />}
    </Stack>
  );
}
