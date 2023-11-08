import { AppContext } from "@/context/app.provider";
import { ITravel } from "@/interfaces/ITravel";
import { Close } from "@mui/icons-material";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Dayjs } from "dayjs";
import { useContext, useEffect, useState } from "react";

interface ITravelDialogProps {
  date: Dayjs;
  handleClose: () => void;
  travel: ITravel;
}

export default function TravelDialogStudent({
  handleClose,
  date,
  travel,
}: ITravelDialogProps) {
  const { profile, showMessage, getDataAuth } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const currentDayTravel = travel.days
    ? travel.days.find((d) => d.day === date.date() && d.active)
    : undefined;

  useEffect(() => {
    alreadyOnList();
  }, []);

  const alreadyOnList = () => {
    if (!currentDayTravel) {
      return <Typography>Dia sem viagem registrada</Typography>;
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
          <TextField
            label="Quer adiconar alguma mensagem?"
            variant="filled"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            inputProps={{ maxLength: 140 }}
            multiline
          />

          <Button onClick={handleSaveClick} fullWidth variant="contained">
            Solicitar vaga
          </Button>
        </>
      );
    }

    return (
      <>
        <Typography>Você já está listado na viagem deste dia</Typography>
        <Typography fontWeight={"bold"}>
          {studentOnTravel.approved ? "Aprovado" : "Aguardando aprovação"}
        </Typography>
      </>
    );
  };

  const handleSaveClick = () => {
    try {
      const data = getDataAuth(`travel/${travel._id}/${date.date()}/other-students`, "post", {
        message: message,
      });
      if (data) {
        showMessage("Vaga solicitada com sucesso", "success");
        handleClose();
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  }

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

      <Stack spacing={2} textAlign={"center"}>
        {alreadyOnList()}
      </Stack>
    </Stack>
  );
}
