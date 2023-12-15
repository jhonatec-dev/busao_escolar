import { DataContext } from "@/context/data.provider";
import { Clear, ExpandLess, ExpandMore, Refresh } from "@mui/icons-material";
import {
  Button,
  Card,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import StudentCard from "./StudentCard";
import StudentSkeleton from "./StudentSkeleton";

export default function Students() {
  const { students, getStudents, loadingStudents } = useContext(DataContext);
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      setOpen(true);
    }
  }, [search]);

  return (
    <Card className="Card" variant="outlined">
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Alunos</Typography>
          <IconButton onClick={async () => await getStudents()}>
            <Refresh />
          </IconButton>
        </Stack>
        <TextField
          label="Pesquisar"
          value={search}
          variant="filled"
          inputProps={{ type: "search" }}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          InputProps={
            search.length > 0
              ? {
                  endAdornment: (
                    <IconButton onClick={() => setSearch("")} size="small">
                      <Clear />
                    </IconButton>
                  ),
                }
              : {}
          }
        />
        <Button
          onClick={() => setOpen(!open)}
          startIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          Ver
        </Button>
        <Collapse in={open}>
          <Stack spacing={2} mt={2}>
            {loadingStudents ? (
              <StudentSkeleton />
            ) : (
              filteredStudents.map((student) => (
                <StudentCard key={student._id} student={student} />
              ))
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
}
