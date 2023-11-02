import { AppContext } from "@/context/appProvider";
import { IStudent } from "@/interfaces/IStudent";
import { Clear } from "@mui/icons-material";
import { Card, IconButton, Stack, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import StudentCard from "./StudentCard";

export default function Students() {
  const { getDataAuth } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<IStudent[]>([]);
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getStudents = async () => {
      const response = await getDataAuth("student", "get");
      if (!response) return;
      console.log(response);
      setStudents(response as IStudent[]);
    };
    getStudents();
  }, []);

  return (
    <>
      <Card className="Card" variant="outlined">
        <TextField
          label="Pesquisar"
          value={search}
          variant="filled"
          inputProps={{type: "search"}}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearch("")}>
                <Clear />
              </IconButton>
            ),
          }}
        />
        <Stack spacing={2} mt={2}>
          {filteredStudents.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))}
        </Stack>
      </Card>
    </>
  );
}
