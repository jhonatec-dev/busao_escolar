import Header from "@/components/Dashboard/Header";
import Students from "@/components/Dashboard/Students";
import { Card, Stack } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  return (
    <>
      <Header />
      <Stack mt={6}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Card>
            <h3>Onibus</h3>
          </Card>
          <Card>
            <h3>Calendário Mensal</h3>
          </Card>
        </Stack>
      </Stack>
      <Stack direction={"row"} spacing={2} flexWrap="wrap">
        <Students />
      </Stack>
    </>
  );
}
