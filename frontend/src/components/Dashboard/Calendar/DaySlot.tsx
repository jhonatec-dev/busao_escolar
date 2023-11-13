import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useContext } from "react";

interface IDaySlotProps {
  highlightedDays?: number[];
}

export default function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const { travel } = useContext(DataContext);
  const { profile } = useContext(AppContext);

  // console.log("highlightedDays", highlightedDays);
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  // calculando a cor
  // verde se o aluno está presente
  // laranja se está como aprovando
  // azul se não está listado
  const chooseColor = () => {
    if (!travel) {
      return "info";
    }

    if (isSelected) {
      const travelDay = travel.days?.find((d) => d.day === props.day.date());
      let listed = travelDay?.frequentStudents.find(
        (s) => s._id === profile?._id
      );
      if (!listed) {
        listed = travelDay?.otherStudents.find((s) => s._id === profile?._id);
      }

      if (listed) {
        return listed.approved ? "success" : "warning";
      }

      return "info";
    }
  };

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      color={chooseColor()}
      invisible={!isSelected}
      variant="dot"
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{ fontSize: "16px" }}
        
      />
    </Badge>
  );
}
