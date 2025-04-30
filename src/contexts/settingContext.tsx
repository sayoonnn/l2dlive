import { createContext, useState, useContext, useCallback } from "react";
import characterPrompts from "@/constants/prompts";

interface OptionTypes {
  caption: boolean;
  instruction: string;
}

interface SettingContextType {
  options: OptionTypes;
  setOptions: (newOptions: OptionTypes) => void;
}

const defaultValue: SettingContextType = localStorage.getItem("options")
  ? JSON.parse(localStorage.getItem("options")!)
  : {
      options: {
        caption: true,
        instruction: characterPrompts.sample,
      },
      setOptions: (OptionTypes) => {},
    };

const SettingContext = createContext<SettingContextType>(defaultValue);

export function SettingProvider({ children }: { children: React.ReactNode }) {
  const [options, _setOptions] = useState(() => {
    const stored = localStorage.getItem("options");
    return stored
      ? (JSON.parse(stored) as OptionTypes)
      : { caption: true, instruction: characterPrompts.sample };
  });

  const setOptions = useCallback(
    (newOptions: OptionTypes) => {
      _setOptions(newOptions);
      localStorage.setItem("options", JSON.stringify(newOptions));
    },
    [options, _setOptions]
  );

  return (
    <SettingContext.Provider value={{ options, setOptions }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettingContext() {
  return useContext(SettingContext);
}
