import PrintContent from "@/components/PrintContent";
import { AppContext } from "@/context/app.provider";
import { DataProvider } from "@/context/data.provider";
import { Home } from "@mui/icons-material";
import { Button, Card, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Print() {
  const { profile } = useContext(AppContext);
  const router = useRouter();
  const { date } = router.query;

  if (!profile || profile.role !== "admin" || !date) {
    return (
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}
        spacing={2}
      >
        <Typography variant="h6">Acesso inválido</Typography>
        <Button
          startIcon={<Home />}
          onClick={() => router.push("/")}
          variant="outlined"
        >
          Voltar
        </Button>
      </Stack>
    );
  }

  const dateStr = date as string;

  const possibleDate = `${dateStr}-01`;
  // console.log("possibleDate", possibleDate, dayjs(possibleDate, "YYYY-MM-DD", true).isValid());

  if (dayjs(possibleDate, "YYYY-MM-DD", true).isValid()) {
    return (
      <DataProvider>
        <PrintContent date={dayjs(possibleDate)} />
      </DataProvider>
    );
  }

  return <Typography variant="h6">Data inválida</Typography>;
}
