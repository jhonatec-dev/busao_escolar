import { AppContext } from "@/context/app.provider";
import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function Bus() {
  const { getDataAuth, showMessage } = useContext(AppContext);
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
    getBus();
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
      <Typography variant="h6">Ônibus padrão</Typography>
      <Stack direction="row" spacing={2} justifyContent={"space-between"}>
        <TextField
          label="Lugares"
          variant="filled"
          fullWidth
          value={bus}
          onChange={(ev) => setBus(Number(ev.target.value))}
          inputProps={{ type: "number" }}
        />
        <Button variant="contained" onClick={handleUpdateBus}>
          Atualizar
        </Button>
      </Stack>
    </Card>
  );
}
