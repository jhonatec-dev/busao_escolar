import { IStudent } from "@/interfaces/IStudent";
import { ITravel } from "@/interfaces/ITravel";
import dayjs, { Dayjs } from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./app.provider";

interface IDataContext {
  travel: ITravel;
  asStudent: boolean;
  setAsStudent: (asStudent: boolean) => void;
  daysHighlightedDB: number[];
  loadMonthTravels: (newDate: Dayjs, travel?: ITravel) => Promise<void>;
  selDate: Dayjs;
  setSelDate: (newDate: Dayjs) => void;
}

export const DataContext = createContext({} as IDataContext);

export const DataProvider = ({ children }: any) => {
  const [travel, setTravel] = useState<ITravel>({} as ITravel);
  const [daysHighlightedDB, setDaysHighlightedDB] = useState<number[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selDate, setSelDate] = useState<Dayjs>(dayjs());
  const [asStudent, setAsStudent] = useState(true);
  const { profile, getDataAuth, showMessage } = useContext(AppContext);

  useEffect(() => {
    if (profile.role === "admin") {
      setAsStudent(false);
    }
  }, []);

  const loadMonthTravels = async (newDate: Dayjs, travel?: ITravel): Promise<void> => {
    // aqui será a funçao para buscar do banco
    // atualizar o estado do daysHighlightedDB

    try {
      // console.log("newDate", newDate);
      let data: ITravel;
      if (travel === undefined) {
        data = await getDataAuth(
          `travel/${newDate.year()}/${newDate.month() + 1}`,
          "get"
        );
      } else {
        data = travel;
      }
      if (data === null || data === undefined) {
        setTravel({} as ITravel);
        setDaysHighlightedDB([]);
      } else {
        setTravel(data);
        const newHighlighted = data.days
          .filter((d) => d.active)
          .map((d) => d.day);
        setDaysHighlightedDB(newHighlighted);
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  };

  const values = {
    travel,
    asStudent,
    setAsStudent,
    daysHighlightedDB,
    loadMonthTravels,
    selDate,
    setSelDate
  };
  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};
