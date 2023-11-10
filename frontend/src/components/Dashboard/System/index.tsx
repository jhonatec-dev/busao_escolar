import { AppContext } from "@/context/app.provider";
import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function System() {
  const { getDataAuth, showMessage, profile } = useContext(AppContext);
  const [busDB, setBusDB] = useState(0);
  const [bus, setBus] = useState(busDB);

  useEffect(() => {
    const getBus = async () => {
      try {
        const response = await getDataAuth("system/bus", "get");
        if (!response) return;
        // console.log(response);
        setBusDB(response as number);
        setBus(response as number);
      } catch (error) {
        showMessage((error as Error).message, "error");
      }
    };
    if (profile.role === "admin") getBus();
  }, []);

  const handleUpdateBus = async () => {
    try {
      if (bus === busDB) return;
      const response = await getDataAuth("system/bus", "patch", { bus });
      if (!response) throw new Error();

      showMessage("Lugares atualizados com sucesso", "success");
    } catch (error) {
      showMessage((error as Error).message, "error");
      setBus(busDB);
    }
  };

  return (
    <Card className="Card" variant="outlined">
      <Stack spacing={2}>
        <Typography variant="h6">Ônibus padrão</Typography>
        <TextField
          label="Lugares"
          variant="filled"
          value={bus}
          fullWidth
          onChange={(ev) => setBus(Number(ev.target.value))}
          inputProps={{ type: "number" }}
          helperText="Valor de base usado ao criar novas viagens"
        />
        <Button variant="contained" onClick={handleUpdateBus}>
          Atualizar
        </Button>
      </Stack>
    </Card>
  );
}
