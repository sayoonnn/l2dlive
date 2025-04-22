import { createContext, useState, useContext } from "react";

interface SettingContextType {
  options: { caption: boolean; mouseTracking: boolean };
  setOptions: React.Dispatch<
    React.SetStateAction<{ caption: boolean; mouseTracking: boolean }>
  >;
}

const defaultValue: SettingContextType = {
  options: { caption: true, mouseTracking: false },
  setOptions: () => {},
};

const SettingContext = createContext<SettingContextType>(defaultValue);

export function SettingProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState({
    caption: true,
    mouseTracking: false,
  });

  return (
    <SettingContext.Provider value={{ options, setOptions }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  return useContext(SettingContext);
}
