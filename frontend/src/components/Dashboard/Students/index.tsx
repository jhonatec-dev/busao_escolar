import { DataContext } from "@/context/data.provider";
import { Clear, Refresh } from "@mui/icons-material";
import { Card, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import StudentCard from "./StudentCard";
import StudentSkeleton from "./StudentSkeleton";

export default function Students() {
  const { students, getStudents, loadingStudents } = useContext(DataContext);
  const [search, setSearch] = useState<string>("");
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log("filteredStudents", filteredStudents);

  useEffect(() => {
    getStudents();
  }, []);

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
        <Stack spacing={2} mt={2}>
          {loadingStudents ? (
            <StudentSkeleton />
          ) : (
            filteredStudents.map((student) => (
              <StudentCard key={student._id} student={student} />
            ))
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
