import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import IRequest from "@/interfaces/IRequest";
import { Card, Stack, ToggleButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useContext } from "react";

interface RequestCardProps {
  request: IRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  // const [showDialog, setShowDialog] = useState(false);
  const formatedDay = dayjs(request.date).format("DD/MM/YYYY");
  const { selDate, setSelDate, setOpenDialogCalendar } =
    useContext(DataContext);
  const { setStudentView } = useContext(AppContext);

  const handleClick = () => {
    if (request.request === "travel") {
      setStudentView(false);
      setOpenDialogCalendar(false);
      setSelDate(dayjs(request.date));
      setTimeout(() => {
        setSelDate(dayjs(request.date));
        setOpenDialogCalendar(true);
      }, 1000);
    }
  };

  return (
    <>
      <Card elevation={2} sx={{ padding: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction={"row"}
            spacing={2}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant='body1' fontWeight={"bold"}>
              {request.name}
            </Typography>
            <Typography variant='h6'>{formatedDay}</Typography>
          </Stack>
          <Stack
            direction={"row"}
            spacing={2}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant='body1'>
              {request.request === "travel" ? "Viagem" : "Perfil"}
            </Typography>
            <ToggleButton
              selected
              value='active'
              size='small'
              onClick={handleClick}
              color='primary'
            >
              Acessar
            </ToggleButton>
          </Stack>
        </Stack>
      </Card>

      {/* <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Tem certeza que deseja excluir o aluno? `}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Isso não pode ser desfeito. {localStudent.name} também não constará
            no registro de todas as viagens futuras.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button>Confirmar</Button>
          <Button onClick={() => setShowDialog(false)} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}
