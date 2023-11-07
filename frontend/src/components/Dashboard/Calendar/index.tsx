import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { ITravel } from "@/interfaces/ITravel";
import { Edit, MoreVert, Print } from "@mui/icons-material";
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import TravelDialog from "../TravelDialog";
import ServerDay from "./DaySlot";

export default function Calendar() {
  const { travel, setTravel } = useContext(DataContext);
  const { showMessage, getDataAuth } = useContext(AppContext);
  const { width } = useWindowSize();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selDate, setSelDate] = useState<Dayjs>(dayjs());
  const [daysHighlightedDB, setDaysHighlightedDB] = useState<number[]>([]);
  const [daysHighlighted, setDaysHighlighted] =
    useState<number[]>(daysHighlightedDB);
  const [openDialog, setOpenDialog] = useState(false);

  // const highlightedDays = [1, 3, 6, 10];

  useEffect(() => {
    getTravelMonth(selDate);
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
      let data: ITravel;
      if (travel === undefined) {
        data = await getDataAuth(
          `travel/${newDate.year()}/${newDate.month() + 1}`,
          "get"
        );
      } else {
        data = travel;
      }

      console.log("travel no handleMonth", data);
      if (data === null || data === undefined) {
        setTravel({} as ITravel);
        setDaysHighlightedDB([]);
        setDaysHighlighted([]);
        setLoading(false);
      } else {
        setTravel(data);
        const newHighlighted = data.days
          .filter((d) => d.active)
          .map((d) => d.day);
        setDaysHighlightedDB(newHighlighted);
        setDaysHighlighted(newHighlighted);
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
      console.log(
        "handleSaveClick \n",
        selDate.year(),
        selDate.month() + 1,
        daysHighlighted
      );
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
          <IconButton onClick={handleMenu}>
            <MoreVert />
          </IconButton>
        </Stack>
        <DateCalendar
          onChange={handleDayClick}
          value={selDate}
          renderLoading={() => <DayCalendarSkeleton />}
          loading={loading}
          onMonthChange={getTravelMonth}
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
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="md"
        fullScreen={width < 800}
      >
        <TravelDialog
          handleClose={handleClose}
          date={selDate}
          travel={travel}
        />

        {/* <TravelDialogStudent
          handleClose={handleClose}
          date={selDate}
          travel={travel}
        /> */}
      </Dialog>
    </>
  );
}
