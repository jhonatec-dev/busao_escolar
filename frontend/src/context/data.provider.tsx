import { IStudent } from "@/interfaces/IStudent";
import { ITravel } from "@/interfaces/ITravel";
import dayjs, { Dayjs } from "dayjs";
import { createContext, useState } from "react";

interface IDataContext {
  travel: ITravel;
  setTravel: (travel: ITravel) => void;
  asStudent: boolean;
  setAsStudent: (asStudent: boolean) => void;
}

export const DataContext = createContext({} as IDataContext);

export const DataProvider = ({ children }: any) => {
  const [travel, setTravel] = useState<ITravel>({} as ITravel);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selDate, setSelDate] = useState<Dayjs>(dayjs());
  const [asStudent, setAsStudent] = useState(true);

  const values = {
    travel,
    setTravel,
    asStudent,
    setAsStudent,
  };
  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};
