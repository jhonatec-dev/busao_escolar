import { ITravelDay } from "@/interfaces/ITravel";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  Divider,
  List,
  ListItem,
  Checkbox,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";

interface IProps {
  day: ITravelDay;
}

export default function DayItem({ day }: IProps) {
  const frequentSits = day.frequentStudents.length;
  const otherSits = day.otherStudents.filter((s) => s.approved).length;
  const freeSits = day.busSits - (frequentSits + otherSits);
  const router = useRouter();
  const { date } = router.query;
  return (
    <Box>
      <Typography variant="h6">
        {dayjs().date(day.day).format("DD")} -{" "}
        {dayjs(`${date}-${day.day}`).locale("pt-br").format("dddd")}
      </Typography>
      <Stack direction={"row"} spacing={2}>
        <Typography variant="body1">{day.busSits} lugares</Typography>
        <Divider orientation="vertical" variant="middle" />
        <Typography variant="body1">{freeSits} livres</Typography>
      </Stack>
      <Stack
        direction={"row"}
        gap={2}
        flexWrap="wrap"
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h6">Alunos frequentes</Typography>
          {day.frequentStudents.map((student, index) => (
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              key={index}
            >
              <CheckBoxOutlineBlank />
              <Typography>
                {student.name} - {student.school}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Stack>
          <Typography variant="h6">Alunos extras</Typography>
          {day.otherStudents.map((student, index) => (
            <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            key={index}
          >
            <CheckBoxOutlineBlank />
            <Typography>
              {student.name} - {student.school}
            </Typography>
          </Stack>
          ))}
        </Stack>
      </Stack>
      <Divider />
    </Box>
  );
}
