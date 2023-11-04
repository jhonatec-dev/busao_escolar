import { Edit, MoreVert, Print } from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import ServerDay from "./DaySlot";

export default function Calendar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [daysHighlightedDB, setDaysHighlightedDB] = useState<number[]>([]);
  const [daysHighlighted, setDaysHighlighted] =
    useState<number[]>(daysHighlightedDB);

  // const highlightedDays = [1, 3, 6, 10];

  useEffect(() => {
    // aqui será a funçao para buscar do banto
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleClose();
    setEditMode(true);
  };

  const handleMonthChange = () => {
    // aqui será a funçao para buscar do banco
    // atualizar o estado do daysHighlightedDB
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleDayClick = (newDate: Dayjs | null) => {
    if (!newDate) return;
    const day = newDate?.date();
    if (editMode) {
      if (daysHighlighted.includes(day)) {
        setDaysHighlighted((prev) => prev.filter((d) => d !== day));
      } else {
        setDaysHighlighted((prev) => [...prev, day]);
      }
    }
  };

  const handleSaveClick = () => {
    setEditMode(false);
    setDaysHighlightedDB(daysHighlighted);
  };

  const handleCancelClick = () => {
    setDaysHighlighted(daysHighlightedDB); // na verdade será do DB
    setEditMode(false);
  };

  return (
    <>
      <Card className="Card" elevation={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Calendário Mensal</Typography>
          <IconButton onClick={handleMenu}>
            <MoreVert />
          </IconButton>
        </Stack>
        <DateCalendar
          onChange={handleDayClick}
          renderLoading={() => <DayCalendarSkeleton />}
          loading={loading}
          onMonthChange={handleMonthChange}
          views={["day"]}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays: daysHighlighted,
            } as any,
          }}
          sx={
            editMode
              ? {
                  "& .MuiPickersArrowSwitcher-root": {
                    opacity: "0.5 !important",
                    pointerEvents: "none",
                  },
                }
              : {}
          }
        />
        {editMode && (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Button
              variant="contained"
              autoFocus
              onClick={handleCancelClick}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveClick}>
              Salvar
            </Button>
          </Stack>
        )}
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
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} /> Editar viagens do mês
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Print sx={{ mr: 1 }} /> Imprimir (Em Construção)
        </MenuItem>
      </Menu>
    </>
  );
}
