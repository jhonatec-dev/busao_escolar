import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Card,
  Collapse,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useContext, useState } from "react";
import { ITravelDialogProps } from ".";
import DialogSkeleton from "./DialogSkeleton";

export default function DialogAdmin({
  handleClose,
  date,
  travel,
}: ITravelDialogProps) {
  const { showMessage, getDataAuth } = useContext(AppContext);
  const { loadMonthTravels } = useContext(DataContext);
  const [frequentOpen, setFrequentOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (currentDayTravel[group][index].approved) return; // cancelar o poder de desmarcar a vaga
    setCurrentDayTravel((prev) => {
      return {
        ...prev,
        [group]: prev[group].map((s, i) => {
          if (i === index) {
            return {
              ...s,
              approved: !s.approved,
            };
          }
          return s;
        }),
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

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      await getDataAuth(
        `travel/${travel._id}/${date.date()}`,
        "put",
        currentDayTravel
      );
      showMessage("Viagem alterada com sucesso", "success");
      await loadMonthTravels();
      handleClose();
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  };

  if(loading) {
    return <DialogSkeleton />
  }

  return (
    <>
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
              sx={{ fontWeight: 600 }}
            >
              Alunos frequentes ({currentDayTravel.frequentStudents.length})
            </Button>
            <Collapse in={frequentOpen}>
              <Stack spacing={2}>
                {currentDayTravel.frequentStudents.map((student, i) => (
                  <Card key={i} elevation={2} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>
                        <strong>Nome:</strong> {student.name}
                      </Typography>
                      <Typography>
                        <strong>Instituição:</strong> {student.school}
                      </Typography>
                      <ToggleButton
                        color={student.approved ? "success" : "warning"}
                        value="check"
                        selected={student.approved}
                        size="small"
                        fullWidth
                        // onClick={() => handleActiveClick("frequentStudents", i)}
                      >
                        {student.approved ? "Confirmado" : "Cancelado"}
                      </ToggleButton>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Collapse>
            <Button
              fullWidth
              variant="text"
              size="large"
              startIcon={otherOpen ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setOtherOpen((prev) => !prev)}
              sx={{ fontWeight: 600 }}
            >
              Outros alunos ({currentDayTravel.otherStudents.length})
            </Button>
            <Collapse in={otherOpen}>
              <Stack spacing={2}>
                {currentDayTravel.otherStudents.map((student, i) => (
                  <Card key={i} elevation={2} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>
                        <strong>Nome:</strong> {student.name}
                      </Typography>
                      <Typography>
                        <strong>Instituição:</strong> {student.school}
                      </Typography>
                      <Typography>
                        <strong>Mensagem:</strong> {student.message}
                      </Typography>
                      <ToggleButton
                        color={student.approved ? "success" : "warning"}
                        value="check"
                        selected
                        size="small"
                        fullWidth
                        onClick={() => handleActiveClick("otherStudents", i)}
                      >
                        {student.approved
                          ? "Confirmado"
                          : "Clique para confirmar"}
                      </ToggleButton>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Collapse>
            <ButtonGroup fullWidth>
              <Button onClick={handleClose} fullWidth variant="outlined">
                Voltar
              </Button>
              <Button onClick={handleSaveClick} fullWidth variant="contained">
                Salvar
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <Typography>Dia sem viagem registrada</Typography>
        )}
      </Stack>
    </>
  );
}
