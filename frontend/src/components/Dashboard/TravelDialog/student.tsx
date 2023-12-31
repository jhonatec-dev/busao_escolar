import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import {
  Button,
  ButtonGroup,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { ITravelDialogProps } from ".";
import DialogSkeleton from "./DialogSkeleton";

export default function DialogStudent({
  handleClose,
  date,
  travel,
}: ITravelDialogProps) {
  const { profile, showMessage, getDataAuth } = useContext(AppContext);
  const { loadMonthTravels } = useContext(DataContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const currentDayTravel = travel.days
    ? travel.days.find((d) => d.day === date.date() && d.active)
    : undefined;

  useEffect(() => {
    alreadyOnList();
  }, []);

  if (loading) {
    return <DialogSkeleton />;
  }

  const alreadyOnList = () => {
    if (!currentDayTravel) {
      return (
        <>
          <Typography>Dia sem viagem registrada</Typography>
          <Button onClick={handleClose} fullWidth variant="outlined">
            Voltar
          </Button>
        </>
      );
    }

    const frequent = currentDayTravel?.frequentStudents.find(
      (s) => s._id === profile?._id
    );
    const other = currentDayTravel?.otherStudents.find(
      (s) => s._id === profile?._id
    );

    const studentOnTravel = frequent || other;

    if (!studentOnTravel) {
      return (
        <>
          <Typography variant="h6">
            Digite uma mensagem e solicite sua vaga
          </Typography>
          <TextField
            label="Mensagem"
            variant="filled"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            inputProps={{ maxLength: 140 }}
            multiline
          />

          <ButtonGroup fullWidth>
            <Button onClick={handleClose} fullWidth variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleSaveClick} fullWidth variant="contained">
              Solicitar vaga
            </Button>
          </ButtonGroup>
        </>
      );
    }

    return (
      <>
        <Typography>Você já está listado na viagem deste dia</Typography>
        <ToggleButton
          value={studentOnTravel.approved}
          selected
          fullWidth
          color={studentOnTravel.approved ? "success" : "warning"}
        >
          {studentOnTravel.approved ? "Aprovado" : "Aguardando aprovação"}
        </ToggleButton>
        <Button onClick={handleClose} fullWidth variant="outlined" size="large">
          Voltar
        </Button>
      </>
    );
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      const data = await getDataAuth(
        `travel/${travel._id}/${date.date()}/other-students`,
        "post",
        {
          message: message,
        }
      );
      if (data) {
        showMessage("Vaga solicitada com sucesso", "success");
        await loadMonthTravels();
        handleClose();
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
      setLoading(false);
    }
  };

  return (
    <Stack p={2} spacing={2}>
      <Stack spacing={2} textAlign={"center"}>
        {alreadyOnList()}
      </Stack>
    </Stack>
  );
}
