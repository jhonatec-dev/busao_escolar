import { AppContext } from "@/context/appProvider";
import { IStudent } from "@/interfaces/IStudent";
import { formatWeekDay } from "@/utils/format";
import { Check, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
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
  const { getDataAuth, showMessage } = useContext(AppContext);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveClick = () => {
    try {
      setLoading(true);
      const data = getDataAuth(`student/frequency/${student._id}`, "patch", {
        ...localStudent.frequency,
      });
      if (data) {
        showMessage("Frequência salva com sucesso", "success");
        setEditMode(false);
      }
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
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
    setEditMode(false);
    setLoading(false);
  };

  const handleDeleteClick = async () => {
    try {
      handleClose();
      setLoading(true);
      const data = await getDataAuth(`student/${student._id}`, "delete");
      showMessage("Aluno excluído com sucesso", "success");
      handleDeleteStudent(student._id as string);
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
      console.log("handleFrequencyChange", ev, value);
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
  }

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
          <Button
            variant="contained"
            color={localStudent.accepted ? "success" : "warning"}
            size="small"
          >
            {localStudent.accepted ? "Ativo" : "Inativo"}
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
          <Typography variant="body1">{localStudent.school}</Typography>
          <IconButton onClick={handleMenu}>
            <MoreVert />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="body1" fontWeight={"bold"}>
            Frequência
          </Typography>
          <ToggleButtonGroup color="primary">
            {localStudent.frequency &&
              Object.keys(localStudent.frequency).map((day) => (
                <ToggleButton
                  key={day}
                  value={day}
                  selected={
                    localStudent.frequency[
                      day as keyof typeof student.frequency
                    ]
                  }
                  onClick={handleFrequencyChange}
                >
                  {formatWeekDay(day)}
                </ToggleButton>
              ))}
          </ToggleButtonGroup>
          {editMode && (
            <Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={handleCancelClick}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
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
          <MenuItem onClick={handleActivateClick}>
            <Check sx={{ mr: 1 }} /> Ativar
          </MenuItem>
        )}
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} /> Editar Frequência
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1 }} /> Excluir
        </MenuItem>
      </Menu>
    </>
  );
}