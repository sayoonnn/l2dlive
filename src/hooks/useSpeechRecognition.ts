import { useState, useEffect } from "react";
import { useSessionContext } from "@/contexts/sessionContext";
import { AudioRecorder } from "@/lib/audio-recorder";

export default function useSpeechRecognition() {
  const { session } = useSessionContext();
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [inVolume, setInVolume] = useState(0);
  const [muted, setMuted] = useState(true);

  const onData = (audioData: string) => {
    session?.sendRealtimeInput({
      audio: { mimeType: "audio/pcm", data: audioData },
    });
  };

  useEffect(() => {
    if (!session) return;

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
