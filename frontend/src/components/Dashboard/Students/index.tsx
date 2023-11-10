import { AppContext } from "@/context/app.provider";
import { IStudent } from "@/interfaces/IStudent";
import { Clear } from "@mui/icons-material";
import { Card, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import StudentCard from "./StudentCard";

export default function Students() {
  const { getDataAuth } = useContext(AppContext);
  const [search, setSearch] = useState<string>("");
  const [students, setStudents] = useState<IStudent[]>([]);
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getStudents = async () => {
      const response = await getDataAuth("student", "get");
      if (!response) return;
      // console.log(response);
      setStudents(response as IStudent[]);
    };
    getStudents();
  }, []);

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student._id !== id));
  };

  return (
    <>
      <Card className="Card" variant="outlined">
        <Typography variant="h6">Alunos</Typography>
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
          {filteredStudents.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              handleDeleteStudent={handleDeleteStudent}
            />
          ))}
        </Stack>
      </Card>
    </>
  );
}
