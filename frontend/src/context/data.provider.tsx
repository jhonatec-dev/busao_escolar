import IRequest from "@/interfaces/IRequest";
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
  loadingStudents: boolean;
  loadingTravel: boolean;
  requests: IRequest[];
  getRequests: () => Promise<void>;
  loadingRequests: boolean;
  openDialogCalendar: boolean;
  setOpenDialogCalendar: (open: boolean) => void;
}

export const DataContext = createContext({} as IDataContext);

export const DataProvider = ({ children }: any) => {
  const [travel, setTravel] = useState<ITravel>({} as ITravel);
  const [loadingTravel, setLoadingTravel] = useState(true);
  const [daysHighlightedDB, setDaysHighlightedDB] = useState<number[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selDate, setSelDate] = useState<Dayjs>(dayjs());
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [openDialogCalendar, setOpenDialogCalendar] = useState(false);
  const { getDataAuth, showMessage } = useContext(AppContext);

  useEffect(() => {
    const getFirstData = async () => {
      await loadMonthTravels();
    };

    getFirstData();
  }, []);

  const getRequests = async (): Promise<void> => {
    try {
      setLoadingRequests(true);
      const response = await getDataAuth("requests", "get");
      if (!response) {
        throw new Error("Erro ao buscar solicitações");
      }
      setRequests(response as IRequest[]);
    } catch (error) {
      setRequests([]);
      showMessage((error as Error).message, "error");
    }
    setLoadingRequests(false);
  };

  const getStudents = async (): Promise<void> => {
    try {
      setLoadingStudents(true);
      const response = await getDataAuth("student", "get");
      if (!response) {
        throw new Error("Erro ao buscar alunos");
      }
      setStudents(response as IStudent[]);
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
    setLoadingStudents(false);
  };

  const loadMonthTravels = async (newDate?: Dayjs): Promise<void> => {
    try {
      setLoadingTravel(true);
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
    setLoadingTravel(false);
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
      loadingStudents,
      loadingTravel,
      requests,
      getRequests,
      loadingRequests,
      openDialogCalendar,
      setOpenDialogCalendar,
    }),
    [
      travel,
      daysHighlightedDB,
      selDate,
      students,
      loadingStudents,
      loadingTravel,
      requests,
      loadingRequests,
      openDialogCalendar,
    ]
  );

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};
