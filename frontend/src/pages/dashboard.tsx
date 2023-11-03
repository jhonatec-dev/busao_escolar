import Bus from "@/components/Dashboard/Bus";
import Header from "@/components/Dashboard/Header";
import Students from "@/components/Dashboard/Students";
import { Card, Stack } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  return (
    <>
      <Header />
      <Stack mt={6} spacing={2}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Bus />
          <Card>
            <h3>Calendário Mensal</h3>
          </Card>
        </Stack>
        <Stack direction={"row"} spacing={2} flexWrap="wrap">
          <Students />
        </Stack>
      </Stack>
    </>
  );
}
