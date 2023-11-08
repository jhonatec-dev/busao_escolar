import Calendar from "@/components/Dashboard/Calendar";
import Header from "@/components/Dashboard/Header";
import Solicitations from "@/components/Dashboard/Solicitations";
import Students from "@/components/Dashboard/Students";
import System from "@/components/Dashboard/System";
import { AppContext } from "@/context/app.provider";
import { DataProvider } from "@/context/data.provider";
import { Stack } from "@mui/material";
import Head from "next/head";
import { useContext } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const { profile } = useContext(AppContext);
  return (
    <>
      <Head>
        <title>Busão Escolar | Dashboard</title>
      </Head>
      <Header />
      <Stack className="Dashboard" mt={4} gap={4}>
        <DataProvider>
          <Stack
            direction="row"
            gap={2}
            flexWrap="wrap"
            justifyContent="center"
          >
            {profile.role === "admin" && <System />}
            <Calendar />
          </Stack>
          {profile.role === "admin" && (
            <Stack
              direction={"row"}
              gap={2}
              flexWrap="wrap"
              justifyContent="center"
            >
              <Students />
              <Solicitations />
            </Stack>
          )}
        </DataProvider>
      </Stack>
    </>
  );
}
