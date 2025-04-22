import React, { useState, useEffect, useCallback } from "react";

import MicInput from "./micInput";
import Menu from "./menu/menu";
import Caption from "./caption";

import { SettingProvider } from "@/contexts/settingContext";

import useSpeechRecognition from "@/hooks/speechRecognition";

export default function UI() {
  const [responseText, setResponseText] = useState("");

  const { start, stop, listening } = useSpeechRecognition({
    onResult: (transcript: string) => setResponseText(transcript),
  });

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
