import { ITravel } from "@/interfaces/ITravel";
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
  const [asStudent, setAsStudent] = useState(false);

  const values = {
    travel,
    setTravel,
    asStudent,
    setAsStudent,
  };
  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};
