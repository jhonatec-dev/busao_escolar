import { AppContext } from "@/context/appProvider";
import { IStudent } from "@/interfaces/IStudent";
import { formatWeekDay } from "@/utils/format";
import { Check, ExitToApp, MoreVert } from "@mui/icons-material";
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
}

export default function StudentCard({ student }: StudentCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const { getDataAuth, showMessage } = useContext(AppContext);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveClick = () => {
    setEditMode(false);
  };

  const handleActivateClick = async () => {
    try {
      handleClose();
      setLoading(true);
      const data = await getDataAuth(`student/accept/${student._id}`, "post");
      if (data) {
        student.accepted = true;
        showMessage("Aluno ativado com sucesso", "success");
      }
    } catch (error: any) {
      showMessage(error.message, "error");
    }
    setEditMode(false);
    setLoading(false);
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
            {student.name}
          </Typography>
          <Button
            variant="contained"
            color={student.accepted ? "success" : "warning"}
            size="small"
          >
            {student.accepted ? "Ativo" : "Inativo"}
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
          <Typography variant="body1">{student.school}</Typography>
          <IconButton onClick={handleMenu}>
            <MoreVert />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="body1" fontWeight={"bold"}>
            Frequência
          </Typography>
          <ToggleButtonGroup color="success">
            {student.frequency &&
              Object.keys(student.frequency).map((day) => (
                <ToggleButton
                  key={day}
                  value={day}
                  selected={
                    student.frequency[
                      day as keyof typeof student.frequency
                    ] as boolean
                  }
                >
                  {formatWeekDay(day)}
                </ToggleButton>
              ))}
          </ToggleButtonGroup>
          {editMode && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleSaveClick}
            >
              Salvar
            </Button>
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
        {!student.accepted && (
          <MenuItem onClick={handleActivateClick}>
            <Check sx={{ mr: 1 }} /> Ativar
          </MenuItem>
        )}
        <MenuItem>
          <ExitToApp sx={{ mr: 1 }} /> Sair
        </MenuItem>
        <MenuItem></MenuItem>
      </Menu>
    </>
  );
}
