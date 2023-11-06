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
  // const [freeSits, setFreeSits] = useState(0);
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

  const frequentSits = currentDayTravel.frequentStudents.filter(
    (s) => s.approved
  ).length;
  const otherSits = currentDayTravel.otherStudents.filter(
    (s) => s.approved
  ).length;
  const freeSits = currentDayTravel.busSits - (frequentSits + otherSits);
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

  const handleBusSitsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDayTravel((prev) => {
      return {
        ...prev,
        busSits: +ev.target.value,
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
            <Stack spacing={2} direction="row" alignItems={"center"}>
              <TextField
                label="Lugares no ônibus"
                variant="filled"
                value={currentDayTravel.busSits}
                onChange={handleBusSitsChange}
                inputProps={{ type: "number" }}
                fullWidth
              />
              <ToggleButton
                color={freeSits > 0 ? "success" : "warning"}
                fullWidth
                value="freeSits"
                selected
                disabled
              >
                {Math.abs(freeSits)} lugares{" "}
                {freeSits >= 0 ? "livres" : "faltando"}
              </ToggleButton>
            </Stack>
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
              rows={4}
              multiline
            />
            <Button
              fullWidth
              variant="text"
              size="large"
              startIcon={frequentOpen ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setFrequentOpen((prev) => !prev)}
            >
              Alunos frequentes ({currentDayTravel.frequentStudents.length})
            </Button>
            <Collapse in={frequentOpen}>
              <Stack spacing={2}>
                {currentDayTravel.frequentStudents.map((student, i) => (
                  <Card key={i} elevation={2} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>{student.name}</Typography>
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
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Collapse>
            <Button
              fullWidth
              variant="text"
              startIcon={otherOpen ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setOtherOpen((prev) => !prev)}
            >
              Outros alunos ({currentDayTravel.otherStudents.length})
            </Button>
            <Collapse in={otherOpen}>
              <Stack spacing={2}>
                {currentDayTravel.otherStudents.map((student, i) => (
                  <Card key={i} elevation={2} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>{student.name}</Typography>
                      <Typography>{student.school}</Typography>
                      <Typography>{student.message}</Typography>
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
                    </Stack>
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
