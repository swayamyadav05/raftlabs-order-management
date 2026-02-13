"use client";

import { useState, useEffect, useRef } from "react";
import type { Order } from "@/types";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  "wss://raftlabs-order-management.onrender.com";

export function useOrderStatus(orderId: string) {
  const [status, setStatus] = useState<Order["status"] | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!orderId) return;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.type === "ORDER_STATUS_UPDATE" &&
            data.orderId === orderId
          ) {
            setStatus(data.status);
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [orderId]);

  return status;
}
