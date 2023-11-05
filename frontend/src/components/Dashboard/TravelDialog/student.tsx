import { ITravel } from "@/interfaces/ITravel";
import { Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Button,
  Card,
  Collapse,
  IconButton,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface ITravelDialogProps {
  date: Dayjs;
  handleClose: () => void;
  travel: ITravel;
}

export default function TravelDialog({
  handleClose,
  date,
  travel,
}: ITravelDialogProps) {
  const [frequentOpen, setFrequentOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const currentDayTravelDB = travel.days
    ? travel.days.find((d) => d.day === date.date())
    : undefined;
  const [currentDayTravel, setCurrentDayTravel] = useState(
    currentDayTravelDB || {
      day: date.date(),
      active: false,
      busSits: 0,
      observations: "",
      frequentStudents: [],
      otherStudents: [],
    }
  );

  const handleActiveClick = (
    group: "frequentStudents" | "otherStudents",
    index: number
  ) => {
    setCurrentDayTravel((prev) => {
      const newStudents = [...prev[group]];
      newStudents[index].approved = !newStudents[index].approved;
      return {
        ...prev,
        [group]: newStudents,
      };
    });
  };

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
      <Stack spacing={2}>
        {currentDayTravel.active ? (
          <>
            <TextField
              label="Lugares no ônibus"
              variant="filled"
              value={currentDayTravel.busSits}
              onChange={(ev) => {
                setCurrentDayTravel((prev) => ({
                  ...prev,
                  busSits: Number(ev.target.value),
                }));
              }}
              inputProps={{ type: "number" }}
              fullWidth
            />
            <TextField
              label="Observações"
              variant="filled"
              fullWidth
              value={currentDayTravel.observations}
              onChange={(ev) => {
                setCurrentDayTravel((prev) => ({
                  ...prev,
                  observations: ev.target.value,
                }));
              }}
              multiline
            />
            <Button
              fullWidth
              variant="outlined"
              startIcon={frequentOpen ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setFrequentOpen((prev) => !prev)}
            >
              Alunos frequentes
            </Button>
            <Collapse in={frequentOpen}>
              <Stack spacing={2}>
                {currentDayTravel.frequentStudents.map((student, i) => (
                  <Card key={i} elevation={2} sx={{ p: 2 }}>
                    <Typography>{student.name}</Typography>
                    <Typography>{student.school}</Typography>
                    <ToggleButton
                      color="primary"
                      value="check"
                      selected={student.approved}
                      size="small"
                      fullWidth
                      onClick={() => handleActiveClick("frequentStudents", i)}
                    >
                      {student.approved ? "Ativado" : "Desativado"}
                    </ToggleButton>
                  </Card>
                ))}
              </Stack>
            </Collapse>
            <Button
              fullWidth
              variant="outlined"
              startIcon={otherOpen ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setOtherOpen((prev) => !prev)}
            >
              Outros alunos
            </Button>
            <Collapse in={otherOpen}>
              <Stack spacing={2}>
                {currentDayTravel.otherStudents.map((student, i) => (
                  <Card key={i} elevation={2} sx={{ p: 2 }}>
                    <Typography>{student.name}</Typography>
                    <Typography>{student.school}</Typography>
                    <ToggleButton
                      color="primary"
                      value="check"
                      selected={student.approved}
                      size="small"
                      fullWidth
                      onClick={() => handleActiveClick("otherStudents", i)}
                    >
                      {student.approved ? "Ativado" : "Desativado"}
                    </ToggleButton>
                  </Card>
                ))}
              </Stack>
            </Collapse>
            <Button fullWidth variant="contained">
              Salvar
            </Button>
          </>
        ) : (
          <Typography>Dia sem viagem registrada</Typography>
        )}
      </Stack>
    </Stack>
  );
}
