import { createContext, useReducer } from "react";
import { dataReducer, dataState } from "./dataReducer";

const defaultDataValues = {
  name: undefined,
};

interface DataContextProps {
    dataState: dataState;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
  const [dataState, dispatchData] = useReducer(dataReducer, defaultDataValues);

  return (
    <DataContext.Provider
      value={{
        dataState,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
