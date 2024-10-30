"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export const useSocket = (userId: string) => {
  const [transactionActivity, setTransactionActivity] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (userId) {
      const socketUrl = process.env.NEXT_PUBLIC_WS_URL + userId;
      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket server");
        setSocket(ws.current)
        setIsConnected(true);
      };
      
      ws.current.onmessage = (event: MessageEvent) => {
        try {
          console.log("Raw message received:", event.data);
          const message = JSON.parse(event.data);
          console.log("Parsed message:", message);
          setTransactionActivity((prev) => [...prev, message]);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setIsConnected(false);
      };

      ws.current.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [userId]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);


  return { transactionActivity, connect, disconnect, socket, isConnected };
};
