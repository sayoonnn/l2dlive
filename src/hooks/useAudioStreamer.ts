import { useEffect, useRef, useState } from "react";
import { AudioStreamer } from "@/lib/audio-streamer";
import { audioContext } from "@/lib/utils";
import VolMeterWorket from "@/lib/worklets/vol-meter";
import { log } from "@/utils/logger";

export default function useAudioStreamer(socket: WebSocket | null) {
  const audioStreamerRef = useRef<AudioStreamer>(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!socket) return;

    audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
      audioStreamerRef.current = new AudioStreamer(audioCtx);
      audioStreamerRef.current
        .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
          setVolume(ev.data.volume);
        })
        .then(() => {
          log("AudioStreamer worklet loaded");
        });
    });

    socket.onmessage = (event: MessageEvent) => {
      const chunk = new Uint8Array(event.data);
      audioStreamerRef.current?.addPCM16(chunk);
    };
  }, [socket, audioStreamerRef]);

  return { audioStreamer: audioStreamerRef.current };
}
