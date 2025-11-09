import { useEffect, useRef, useCallback } from "react";

type PriceUpdate = {
  id: string;
  price: number;
  timestamp: number;
};

type UseWebSocketProps = {
  onPriceUpdate: (update: PriceUpdate) => void;
  enabled?: boolean;
};

export function useWebSocket({ onPriceUpdate, enabled = true }: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  // Important: use ReturnType<typeof setTimeout> in browser (not NodeJS.Timeout)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    // Avoid duplicate connections if one is OPEN / CONNECTING
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;

    const { protocol, host } = window.location; // 'host' includes port
    const wsProto = protocol === "https:" ? "wss:" : "ws:";
    const url = `${wsProto}//${host}/ws`;

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        // connected
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as PriceUpdate;
          onPriceUpdate(msg);
        } catch (err) {
          // swallow malformed messages to keep the socket alive
          console.error("WS parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        if (reconnectRef.current) clearTimeout(reconnectRef.current);
        reconnectRef.current = setTimeout(() => {
          wsRef.current = null;
          connect();
        }, 5000);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error("WebSocket create error:", err);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      reconnectRef.current = setTimeout(() => {
        wsRef.current = null;
        connect();
      }, 5000);
    }
  }, [enabled, onPriceUpdate]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) wsRef.current.close();
      wsRef.current = null;
    };
  }, [connect]);

  return { isConnected: wsRef.current?.readyState === WebSocket.OPEN };
}
