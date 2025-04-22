import { createContext, useState, useContext } from "react";

interface SettingContextType {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
}

const defaultValue: SettingContextType = {
  model: "sample",
  setModel: () => {},
};

const ModelContext = createContext<SettingContextType>(defaultValue);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState("sample");

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModelSetting() {
  return useContext(ModelContext);
}
