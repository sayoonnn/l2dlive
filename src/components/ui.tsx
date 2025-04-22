"use client";

import React, { useState, useEffect, useCallback } from "react";

import MicInput from "./micInput";
import Menu from "./menu/menu";
import Caption from "./caption";

import { useModelSetting } from "@/contexts/modelContext";
import { SettingProvider } from "@/contexts/settingContext";

import useSpeechRecognition from "@/hooks/speechRecognition";

export default function UI() {
  const [responseText, setResponseText] = useState("");
  const { model } = useModelSetting();

  const handleResponse = useCallback(async (transcript: string) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ model: model, text: transcript }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (response.ok) {
      let result = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        result += decoder.decode(value);
        setResponseText(result);
      }
    } else {
      console.error("Error:", response.statusText);
    }
  }, []);

  const { start, stop, listening } = useSpeechRecognition({
    onResult: handleResponse,
  });

  useEffect(() => {
    setResponseText("");
    stop();
  }, [model]);

  return (
    <SettingProvider>
      <Menu />
      <div className="absolute bottom-0 w-full justify-center">
        <Caption text={responseText} />
        <MicInput
          isRecording={listening}
          startRecognition={start}
          stopRecognition={stop}
        />
      </div>
    </SettingProvider>
  );
}
