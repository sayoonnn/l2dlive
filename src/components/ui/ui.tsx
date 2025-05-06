import React, { useEffect } from "react";
import useAutoReconnectWebSocket from "@/hooks/useAutoReconnectWebSocket";

import Menu from "@/components/menu/Menu";
import Caption from "@/components/ui/Caption";
import MicInput from "@/components/ui/MicInput";

import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioStreamer from "@/hooks/useAudioStreamer";

export default function UI() {
  const { socket: audioSocket, readyState } = useAutoReconnectWebSocket(
    `${import.meta.env.VITE_SERVER_URL}`
  );
  const { muted, setMuted } = useAudioRecorder(audioSocket);
  const { audioStreamer } = useAudioStreamer(audioSocket);

  useEffect(() => {
    if (audioStreamer) {
      audioStreamer.resume();
    }

    return () => {
      if (audioStreamer) {
        audioStreamer.stop();
      }
    };
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
