import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { Edit, MoreVert, Print, Refresh } from "@mui/icons-material";
import {
  Box,
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
import Caption from "./Caption";
import ServerDay from "./DaySlot";

export default function Calendar() {
  const {
    travel,
    daysHighlightedDB,
    selDate,
    setSelDate,
    loadMonthTravels,
    loadingTravel,
    setOpenDialogCalendar,
    openDialogCalendar,
    getRequests,
  } = useContext(DataContext);
  const { showMessage, getDataAuth, profile } = useContext(AppContext);
  const { width } = useWindowSize();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [daysHighlighted, setDaysHighlighted] =
    useState<number[]>(daysHighlightedDB);
  const router = useRouter();

  // const highlightedDays = [1, 3, 6, 10];

  useEffect(() => {
    const getData = async () => {
      await loadMonthTravels();
    };
    getData();
  }, []);

  useEffect(() => {
    if (!travel) {
      setDaysHighlighted([]);
    } else {
      setDaysHighlighted(daysHighlightedDB);
    }
  }, [travel, daysHighlightedDB]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDialogCalendar(false);
  };

  const handleEditClick = () => {
    handleClose();
    setEditMode(true);
  };

  const handleDayClick = (newDate: Dayjs | null) => {
    console.log("handleDayClick", newDate);
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
      setOpenDialogCalendar(true);
    }
  };

  const handleSaveClick = async () => {
    // enviar para o backend
    try {
      if (daysHighlighted.join() === daysHighlightedDB.join()) {
        throw new Error("Não há nada para alterar");
      }
      await getDataAuth("travel", "post", {
        year: selDate.year(),
        month: selDate.month() + 1,
        days: daysHighlighted,
      });
      showMessage("Calendário de viagens salvo com sucesso", "success");
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
    await loadMonthTravels();
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setDaysHighlighted(daysHighlightedDB); // na verdade será do DB
    setEditMode(false);
  };

  const handlePrintClick = () => {
    router.push(`/print/${selDate.format("YYYY-MM")}`);
  };

  const refresh = async () => {
    await loadMonthTravels();
    await getRequests();
  }

  return (
    <Stack gap={2} direction="row" justifyContent="center" flexWrap="wrap">
      <Card className="Card" variant="outlined">
        <Typography variant="h6">Calendário Mensal</Typography>

        <Typography variant="body2">
          Clique no dia desejado para conferir o status de sua vaga
        </Typography>
        <Caption editMode={editMode} />
      </Card>
      <Card className="Card" variant="outlined">
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              disabled={editMode}
              onClick={() => setSelDate(dayjs())}
            >
              Hoje
            </Button>
            <Box>
              <IconButton
                disabled={editMode}
                onClick={refresh}
              >
                <Refresh />
              </IconButton>
              {profile.role === "admin" && (
                <IconButton disabled={editMode} onClick={handleMenu}>
                  <MoreVert />
                </IconButton>
              )}
            </Box>
          </Stack>
          <DateCalendar
            onChange={handleDayClick}
            value={selDate}
            renderLoading={() => <DayCalendarSkeleton />}
            loading={loadingTravel}
            disablePast={profile.role !== "admin"}
            onMonthChange={loadMonthTravels}
            dayOfWeekFormatter={(_day, date) => date.format("ddd")}
            views={["day"]}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays: daysHighlighted,
                editMode,
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
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} /> Editar viagens do mês
        </MenuItem>
        <Divider />
        <MenuItem onClick={handlePrintClick}>
          <Print sx={{ mr: 1 }} /> Imprimir
        </MenuItem>
      </Menu>
      <Dialog
        open={openDialogCalendar}
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
    </Stack>
  );
}
