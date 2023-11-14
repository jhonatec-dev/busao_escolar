import { AppContext } from "@/context/app.provider";
import { DataContext } from "@/context/data.provider";
import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useContext } from "react";

interface IDaySlotProps {
  highlightedDays?: number[];
  editMode?: boolean;
}

export default function ServerDay(
  props: PickersDayProps<Dayjs> & {
    highlightedDays?: number[];
    editMode?: boolean;
  }
) {
  const {
    highlightedDays = [],
    day,
    outsideCurrentMonth,
    editMode,
    ...other
  } = props;
  const { travel, daysHighlightedDB } = useContext(DataContext);
  const { profile } = useContext(AppContext);

  // console.log("highlightedDays", highlightedDays);
  let isSelected = false;
  if (editMode) {
    isSelected =
      (!props.outsideCurrentMonth &&
        daysHighlightedDB.includes(props.day.date())) ||
      (!props.outsideCurrentMonth &&
        highlightedDays.includes(props.day.date()));
  } else {
    isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;
  }

  // calculando a cor
  // verde se o aluno está presente
  // laranja se está como aprovando
  // azul se não está listado
  const chooseColor = () => {
    if (!travel) {
      return "info";
    }

    if (profile.role === "admin") {
      if (editMode) {
        if (
          highlightedDays.includes(props.day.date()) &&
          !daysHighlightedDB.includes(props.day.date())
        ) {
          return "success";
        } else if (highlightedDays.includes(props.day.date())) {
          return "primary";
        } else {
          return "error";
        }
      }
      const travelDay = travel.days?.find((d) => d.day === props.day.date());
      let others = travelDay?.otherStudents.some((s) => !s.approved);
      return others ? "warning" : "primary";
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
