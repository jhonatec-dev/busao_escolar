import Bus from "@/components/Dashboard/Bus";
import Calendar from "@/components/Dashboard/Calendar";
import Header from "@/components/Dashboard/Header";
import Students from "@/components/Dashboard/Students";
import { Stack } from "@mui/material";
import Head from "next/head";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Busão Escolar | Dashboard</title>
      </Head>
      <Header />
      <Stack className="Dashboard" mt={4} gap={4}>
        <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
          <Bus />
          <Calendar />
        </Stack>
        <Stack
          direction={"row"}
          gap={2}
          flexWrap="wrap"
          justifyContent="center"
        >
          <Students />
        </Stack>
      </Stack>
    </>
  );
}
