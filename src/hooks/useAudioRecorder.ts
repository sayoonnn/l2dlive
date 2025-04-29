import { useState, useEffect } from "react";
import { AudioRecorder } from "@/lib/audio-recorder";

export default function useAudioRecorder(socket: WebSocket | null) {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [inVolume, setInVolume] = useState(0);
  const [muted, setMuted] = useState(true);

  const onData = (audioData: string) => socket?.send(audioData);

  useEffect(() => {
    if (!muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [muted, audioRecorder]);

  return { muted, setMuted };
}
