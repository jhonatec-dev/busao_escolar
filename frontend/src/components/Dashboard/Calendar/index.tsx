import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { ITravel } from "@/interfaces/ITravel";
import { Edit, MoreVert, Print } from "@mui/icons-material";
import {
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import TravelDialog from "../TravelDialog";
import ServerDay from "./DaySlot";

export default function Calendar() {
  const { travel, loadMonthTravels, daysHighlightedDB, selDate, setSelDate } =
    useContext(DataContext);
  const { showMessage, getDataAuth, profile } = useContext(AppContext);
  const { width } = useWindowSize();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  console.log(
    "renderizou o calendar",
    travel.days?.length,
    daysHighlightedDB.length
  );
  const [daysHighlighted, setDaysHighlighted] =
    useState<number[]>(daysHighlightedDB);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  // const highlightedDays = [1, 3, 6, 10];

  useEffect(() => {
    loadMonthTravels(dayjs());
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDialog(false);
  };

  const handleEditClick = () => {
    handleClose();
    setEditMode(true);
  };

  const getTravelMonth = async (newDate: Dayjs, travel?: ITravel) => {
    // aqui será a funçao para buscar do banco
    // atualizar o estado do daysHighlightedDB

    try {
      setLoading(true);
      // console.log("newDate", newDate);
      await loadMonthTravels(newDate, travel);
      if (!travel) {
        setDaysHighlighted([]);
        setLoading(false);
      } else {
        console.log("imprimindo", daysHighlightedDB);
        setDaysHighlighted(daysHighlightedDB);
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
    }

    setLoading(false);
  };

  const handleDayClick = (newDate: Dayjs | null) => {
    if (!newDate) return;
    setSelDate(newDate);
    const day = newDate?.date();
    if (editMode) {
      if (daysHighlighted.includes(day)) {
        setDaysHighlighted((prev) => prev.filter((d) => d !== day));
      } else {
        setDaysHighlighted((prev) => [...prev, day]);
      }
    } else {
      setOpenDialog(true);
    }
  };

  const handleSaveClick = async () => {
    // enviar para o backend
    try {
      if (daysHighlighted === daysHighlightedDB) {
        throw new Error("Não há nada para alterar");
      }
      const data = (await getDataAuth("travel", "post", {
        year: selDate.year(),
        month: selDate.month() + 1,
        days: daysHighlighted,
      })) as ITravel;
      getTravelMonth(selDate, data);
      showMessage("Calendário de viagens salvo com sucesso", "success");
    } catch (error) {
      showMessage((error as Error).message, "error");
    }

    setEditMode(false);
  };

  const handleCancelClick = () => {
    setDaysHighlighted(daysHighlightedDB); // na verdade será do DB
    setEditMode(false);
  };

  return (
    <>
      <Card className="Card" variant="outlined">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Calendário Mensal</Typography>
          {profile.role === "admin" && (
            <IconButton onClick={handleMenu}>
              <MoreVert />
            </IconButton>
          )}
        </Stack>
        <Typography variant="body1">
          Clique no dia marcado em azul para agendar uma vaga ou consultar se já
          foi aprovada
        </Typography>
        <DateCalendar
          onChange={handleDayClick}
          value={selDate}
          renderLoading={() => <DayCalendarSkeleton />}
          loading={loading}
          disablePast={profile.role !== "admin"}
          onMonthChange={getTravelMonth}
          dayOfWeekFormatter={(_day, date) => date.format("ddd")}
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
        <Divider />
        <MenuItem onClick={handleClose}>
          <Print sx={{ mr: 1 }} /> Imprimir (Em Construção)
        </MenuItem>
      </Menu>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="md"
        fullScreen={width < 800}
      >
        <TravelDialog
          date={selDate}
          handleClose={handleClose}
          travel={travel}
        />
      </Dialog>
    </>
  );
}
