import { useEffect, useRef } from "react";
import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import { log } from "@/utils/logger";

export default function useChatResponse(
  modelRef: React.RefObject<Live2DModel | null>
) {
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const textSocket = new WebSocket("ws://183.101.161.244:8000/ws-text");
    const audioSocket = new WebSocket("ws://183.101.161.244:8000/ws-audio");

    textSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      log("📜 자막:", data.text);
    };

    audioSocket.onmessage = async (event) => {
      const arrayBuffer = await event.data.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      audioQueueRef.current.push(url);
      tryPlayNext();
    };

    const tryPlayNext = () => {
      if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

      const nextUrl = audioQueueRef.current.shift();
      if (!nextUrl || !modelRef.current) return;

      isPlayingRef.current = true;

      const onFinish = () => {
        isPlayingRef.current = false;
        setTimeout(() => {
          tryPlayNext();
        }, 500);
      };

      const onError = () => {
        isPlayingRef.current = false;
        setTimeout(() => {
          tryPlayNext();
        }, 500);
      };

      modelRef.current.speak(nextUrl, {
        expression: "bad_smile",
        onError,
        onFinish,
      });
    };

    return () => {
      textSocket.close();
      audioSocket.close();
    };
  }, [modelRef]);
}
