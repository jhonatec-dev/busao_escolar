import { Button, Card, Stack, TextField, Typography } from "@mui/material";

export default function Bus() {
  return (
    <Card className="Card" variant="outlined">
      <Typography variant="h6">Ônibus padrão</Typography>
      <Stack direction="row" spacing={2} justifyContent={"space-between"}>
        <TextField
          label="Lugares"
          variant="filled"
          fullWidth
          inputProps={{ type: "number" }}
        />
        <Button variant="contained">Atualizar</Button>
      </Stack>
    </Card>
  );
}
