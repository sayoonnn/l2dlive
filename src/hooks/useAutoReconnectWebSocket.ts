import { useEffect, useRef, useState, useCallback } from "react";
import { log, warn, error } from "@/utils/logger";

type ReadyState = WebSocket["readyState"];

export default function useAutoReconnectWebSocket(
  url: string,
  maxRetries = 5,
  initialDelay = 1000
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>(WebSocket.CLOSED);
  const retryCountRef = useRef(0);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;
    setReadyState(ws.readyState);

    ws.onopen = () => {
      retryCountRef.current = 0;
      setReadyState(ws.readyState);
      log("WebSocket connected");
    };

    ws.onerror = (e) => {
      error("WebSocket error", e);
    };

    ws.onclose = (e) => {
      setReadyState(ws.readyState);
      console.warn(`WebSocket closed (code=${e.code}).`);
      if (retryCountRef.current < maxRetries) {
        const delay = initialDelay * 2 ** retryCountRef.current;

        retryCountRef.current += 1;
        log(`Reconnecting in ${delay}ms… (attempt ${retryCountRef.current})`);
        setTimeout(connect, delay);
      } else {
        error("Max reconnect attempts reached.");
      }
    };
  }, [url, maxRetries, initialDelay]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  return { socket: socketRef.current, readyState };
}
