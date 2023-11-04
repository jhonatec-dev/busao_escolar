import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export default function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      color="info"
      invisible={!isSelected}
      variant="dot"
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} sx={{ fontSize: "16px" }} />
    </Badge>
  );
}