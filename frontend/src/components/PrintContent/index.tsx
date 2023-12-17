import Logo from "@/components/Logo";
import { AppContext } from "@/context/app.provider";
import { DataContext, DataProvider } from "@/context/data.provider";
import { ITravel } from "@/interfaces/ITravel";
import { CheckBox, Print } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useEffect } from "react";
import DayItem from "./DayItem";

interface IProps {
  date: Dayjs;
}

export default function PrintContent({ date }: IProps) {
  const { travel, loadMonthTravels } = useContext(DataContext);

  useEffect(() => {
    const getData = async () => {
      await loadMonthTravels(dayjs(date));
    };
    getData();
  }, []);

  return (
    <div className="Print">
      <Button
        className="hide-on-print button-print"
        onClick={() => window.print()}
        startIcon={<Print />}
        size="large"
        fullWidth
        variant="contained"
      >
        Imprimir
      </Button>
      <Stack gap={1} px={1}>
        <Logo size={50} />
        <Typography variant="h6">
          {dayjs()
            .month(travel.month - 1)
            .locale("pt-br")
            .format("MMMM")
            .toUpperCase()}
          /{travel.year}
        </Typography>
        {travel.days &&
          travel.days.map((day, index) => <DayItem key={index} day={day} />)}
      </Stack>
    </div>
  );
}
