import React, { useEffect } from "react";
import useAutoReconnectWebSocket from "@/hooks/useAutoReconnectWebSocket";

import Menu from "@/components/menu/menu";
import Caption from "@/components/ui/caption";
import MicInput from "@/components/ui/micInput";

import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioStreamer from "@/hooks/useAudioStreamer";

export default function UI() {
  const { socket: audioSocket, readyState } = useAutoReconnectWebSocket(
    `${import.meta.env.VITE_SERVER_URL_WS}/ws/audio`
  );
  const { muted, setMuted } = useAudioRecorder(audioSocket);
  const { audioStreamer } = useAudioStreamer(audioSocket);

  useEffect(() => {
    if (audioStreamer) {
      audioStreamer.resume();
    }
  }, []);

  useEffect(() => {
    if (readyState !== WebSocket.OPEN) setMuted(true);
  }, [audioStreamer]);

  return (
    <>
      <Menu />
      <div className="absolute bottom-0 w-full justify-center">
        <Caption text={""} />

        <MicInput
          isRecording={!muted}
          startRecognition={() => {
            if (readyState !== WebSocket.OPEN) {
              return;
            }
            setMuted(false);
          }}
          stopRecognition={() => setMuted(true)}
        />
      </div>
    </>
  );
}
