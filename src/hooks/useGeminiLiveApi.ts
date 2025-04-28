import { GoogleGenAI, Modality, Session } from "@google/genai";
import { useState, useEffect } from "react";
import { log, error } from "@/utils/logger";
import characterPrompts from "@/constants/prompts";
import { useSettingContext } from "@/contexts/settingContext";

export default function useGeminiLiveApi(): {
  session: Session | null;
  sessionStatus: string;
  result: string;
} {
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<string>("Disconnected");
  const { options } = useSettingContext();

  useEffect(() => {
    if (!options.apiKey) return;

    const gemini = new GoogleGenAI({ apiKey: options.apiKey });

    (async () => {
      const currentSession = await gemini.live.connect({
        model: "gemini-2.0-flash-live-001",
        config: {
          responseModalities: [Modality.TEXT],
          systemInstruction: {
            role: "system",
            parts: [{ text: characterPrompts.sample }],
          },
        },
        callbacks: {
          onopen: () => log("Connected"),
          onmessage: (e) => {
            const { serverContent } = e;
            if (!serverContent) return;

            const text = serverContent.modelTurn?.parts?.[0]?.text || "";
            setResult((prev) => prev + text);
          },
          onerror: (e) => error("Error:", e.error),
          onclose: (e) => {
            if (e.code === 1007) {
              setSessionStatus("Invalid API key");
              error("Invalid API Key");
            }
            log("Disconnected");
            setSession(null);
            return;
          },
        },
      });

      setSessionStatus("Connected");
      setSession(currentSession);
    })();
  }, [options.apiKey]);

  useEffect(() => {
    if (session) {
      session.updateConfig({
        systemInstruction: new Content({
          parts: [new Part({ text: newInstruction })],
        }),
      });
    }
  }, [options.instruction]);

  return { session, sessionStatus, result };
}
