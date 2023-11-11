import { IStudent } from "@/interfaces/IStudent";
import { ITravel } from "@/interfaces/ITravel";
import dayjs, { Dayjs } from "dayjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "./app.provider";

interface IDataContext {
  travel: ITravel;
  daysHighlightedDB: number[];
  loadMonthTravels: (newDate?: Dayjs) => Promise<void>;
  selDate: Dayjs;
  setSelDate: (newDate: Dayjs) => void;
  students: IStudent[];
  getStudents: () => Promise<void>;
}

export const DataContext = createContext({} as IDataContext);

export const DataProvider = ({ children }: any) => {
  const [travel, setTravel] = useState<ITravel>({} as ITravel);
  const [daysHighlightedDB, setDaysHighlightedDB] = useState<number[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selDate, setSelDate] = useState<Dayjs>(dayjs());
  const { profile, getDataAuth, showMessage } = useContext(AppContext);

  useEffect(() => {
    const getFirstData = async () => {
      await loadMonthTravels();
      if (profile.role === "admin") {
        await getStudents();
      }
    };

    getFirstData();
  }, []);

  const getStudents = async (): Promise<void> => {
    try {
      const response = await getDataAuth("student", "get");
      console.log(response);
      if (!response) return;
      setStudents(response as IStudent[]);
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  };

  const loadMonthTravels = async (newDate?: Dayjs): Promise<void> => {
    try {
      const date = newDate ? newDate : selDate.startOf("month");
      const data = (await getDataAuth(
        `travel/${date.year()}/${date.month() + 1}`,
        "get"
      )) as ITravel;
      // console.log("imprimindo", data);
      if (data === null || data === undefined) {
        setTravel({} as ITravel);
        setDaysHighlightedDB([]);
      } else {
        setTravel(data);
        const newHighlighted = data.days
          .filter((d) => d.active)
          .map((d) => d.day);
        setDaysHighlightedDB([]);
        setDaysHighlightedDB(newHighlighted);
      }
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  };

  const values = useMemo(
    () => ({
      travel,
      daysHighlightedDB,
      loadMonthTravels,
      selDate,
      setSelDate,
      students,
      getStudents,
    }),
    [travel, daysHighlightedDB, selDate, students]
  );

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};
