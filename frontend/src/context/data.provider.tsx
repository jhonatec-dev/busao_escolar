import { ITravel } from "@/interfaces/ITravel";
import { createContext, useContext, useState } from "react";
import { AppContext } from "./app.provider";

interface IDataContext {
  travel: ITravel;
  setTravel: (travel: ITravel) => void;
  getMonthTravel: (year: number, month: number) => void;
  setMonthTravel: (year: number, month: number) => void;

}

export const DataContext = createContext({} as IDataContext);

export const DataProvider = ({ children }: any) => {
  const { getDataAuth, showMessage } = useContext(AppContext);
  const [travel, setTravel] = useState<ITravel>({} as ITravel);

  const getMonthTravel = async (year: number, month: number) => {
    // getMonthTravel
    try {
      const data = await getDataAuth(`travel/${year}/${month}`, "get");
      if (!data) return;
      setTravel(data as ITravel);
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
  };

  const setMonthTravel = (year: number, month: number) => {
    // setMonthTravel
  };

  const values = {
    travel,
    setTravel,
    getMonthTravel,
    setMonthTravel,
  };
  return (
    <DataContext.Provider value={values}>{children}</DataContext.Provider>
  );
};
