import React, { useState, useEffect, useCallback } from "react";
import { SettingProvider } from "@/contexts/settingContext";

import Menu from "@/components/menu/menu";
import Caption from "@/components/ui/caption";
import MicInput from "@/components/ui/micInput";

import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useSessionContext } from "@/contexts/sessionContext";

export default function UI() {
  const { sessionStatus, result } = useSessionContext();
  const { muted, setMuted } = useSpeechRecognition();

  return (
    <>
      <Menu />
      {sessionStatus == "Connected" && (
        <div className="absolute bottom-0 w-full justify-center">
          <Caption text={result} />

          <MicInput
            isRecording={!muted}
            startRecognition={() => setMuted(false)}
            stopRecognition={() => setMuted(true)}
          />
        </div>
      )}
    </>
  );
}
