import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { IStudent } from "@/interfaces/IStudent";
import { formatWeekDay } from "@/utils/format";
import { Check, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";

interface StudentCardProps {
  student: IStudent;
  handleDeleteStudent: (id: string) => void;
}

export default function StudentCard({
  student,
  handleDeleteStudent,
}: StudentCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localStudent, setLocalStudent] = useState(student);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { getDataAuth, showMessage, profile, logout } = useContext(AppContext);
  const { loadMonthTravels } = useContext(DataContext);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      await getDataAuth(`student/frequency/${student._id}`, "patch", {
        ...localStudent.frequency,
      });

      showMessage("Frequência salva com sucesso", "success");
      setEditMode(false);
      await loadMonthTravels();
    } catch (error) {
      showMessage((error as Error).message, "error");
      handleCancelClick();
    }
    setLoading(false);
  };

  const handleActivateClick = async () => {
    try {
      handleClose();
      setLoading(true);
      const data = await getDataAuth(`student/accept/${student._id}`, "patch");
      if (data) {
        setLocalStudent((prev) => ({ ...prev, accepted: true }));
        showMessage("Aluno ativado com sucesso", "success");
        loadMonthTravels();
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
    setEditMode(false);
    setLoading(false);
  };

  const handleDeleteClick = async () => {
    try {
      setShowDialog(false);
      handleClose();
      setLoading(true);
      const data = await getDataAuth(`student/${student._id}`, "delete");
      showMessage("Aluno excluído com sucesso", "success");
      if (student._id === profile._id) {
        logout();
      }
      handleDeleteStudent(student._id as string);
      loadMonthTravels();
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
    setLoading(false);
  };

  const handleFrequencyChange = (
    ev: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    handleClose();
    // resetar a frequência, em caso de cancelamento
    if (editMode) {
      // console.log("handleFrequencyChange", ev, value);
      setLocalStudent((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          [value as keyof typeof prev.frequency]:
            !prev.frequency[value as keyof typeof prev.frequency],
        },
      }));
    }
  };

  const handleCancelClick = () => {
    setLocalStudent(student);
    setEditMode(false);
  };

  const handleEditClick = () => {
    handleClose();
    setEditMode(true);
  };

  if (loading) {
    return (
      <Card elevation={2} sx={{ padding: 2 }}>
        <Stack justifyContent={"center"} alignItems={"center"}>
          <CircularProgress />
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <Card elevation={2} sx={{ padding: 2 }}>
        <Stack
          direction={"row"}
          spacing={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="body1" fontWeight={"bold"}>
            {localStudent.name}
          </Typography>
          <IconButton onClick={handleMenu}>
            <MoreVert />
          </IconButton>
        </Stack>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
          <Typography variant="body1">{localStudent.school}</Typography>
          <ToggleButton
            color={localStudent.accepted ? "success" : "warning"}
            selected
            value="active"
            size="small"
          >
            {localStudent.accepted ? "Ativo" : "Inativo"}
          </ToggleButton>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="body1" fontWeight={"bold"}>
            Frequência
          </Typography>
          <ToggleButtonGroup color="primary">
            {localStudent.frequency &&
              Object.keys(localStudent.frequency).map((day) => (
                <Tooltip title={formatWeekDay(day)} key={day}>
                  <ToggleButton
                    key={day}
                    value={day}
                    onChange={handleFrequencyChange}
                    selected={
                      localStudent.frequency[
                        day as keyof typeof student.frequency
                      ]
                    }
                  >
                    {formatWeekDay(day)[0]}
                  </ToggleButton>
                </Tooltip>
              ))}
          </ToggleButtonGroup>
          {editMode && (
            <Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
              <Button
                variant="contained"
                color="inherit"
                size="small"
                onClick={handleCancelClick}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={handleSaveClick}
              >
                Salvar
              </Button>
            </Stack>
          )}
        </Stack>
      </Card>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!localStudent.accepted && (
          <>
            <MenuItem onClick={handleActivateClick}>
              <Check sx={{ mr: 1 }} /> Ativar
            </MenuItem>
            <Divider />
          </>
        )}

        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} /> Editar Frequência
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setShowDialog(true)}>
          <Delete sx={{ mr: 1 }} /> Excluir
        </MenuItem>
      </Menu>
      <Dialog
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
          <Button onClick={handleDeleteClick}>Confirmar</Button>
          <Button onClick={() => setShowDialog(false)} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
