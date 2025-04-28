import { createContext, useContext } from "react";
import { Session } from "@google/genai";
import useGeminiLiveApi from "@/hooks/useGeminiLiveApi";

interface SettingContextType {
  session: Session | null;
  sessionStatus: string;
  result: string;
}

const defaultValue: SettingContextType = {
  session: null,
  sessionStatus: "Disconnected",
  result: "",
};

const SessionContext = createContext<SettingContextType>(defaultValue);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { session, sessionStatus, result } = useGeminiLiveApi();

  return (
    <SessionContext.Provider value={{ session, sessionStatus, result }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
