import Calendar from "@/components/Dashboard/Calendar";
import Header from "@/components/Dashboard/Header";
import Requests from "@/components/Dashboard/Requests";
import Students from "@/components/Dashboard/Students";
import System from "@/components/Dashboard/System";
import { AppContext } from "@/context/app.provider";
import { DataProvider } from "@/context/data.provider";
import { Stack } from "@mui/material";
import Head from "next/head";
import { useContext, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const { profile, setLoginLoading } = useContext(AppContext);
  useEffect(() => {
    setLoginLoading(false);
  }, []);
  return (
    <>
      <Head>
        <title>Busão Escolar | Dashboard</title>
      </Head>
      <Header />
      <Stack className="Dashboard" pt={"70px"} gap={4}>
        <DataProvider>
          <Calendar />

          {profile.role === "admin" && (
            <Stack
              direction={"row"}
              gap={2}
              flexWrap="wrap"
              justifyContent="center"
            >
              <Students />
              <Requests />
            </Stack>
          )}
        </DataProvider>
      </Stack>
    </>
  );
}
