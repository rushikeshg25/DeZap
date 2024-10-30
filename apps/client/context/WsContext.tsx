"use client"
import { useSession } from 'next-auth/react';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface IWsContext {
    socket: WebSocket | null;
    isConnected: boolean;
}
  
const WebSocketContext = createContext<IWsContext>({
    isConnected: false,
    socket: null,
});

export function useWebSocket() {
    const value = useContext(WebSocketContext);
    if (process.env.NODE_ENV !== 'production') {
      if (!value) {
        throw new Error('useWebSocket must be wrapped in a <WebSocketProvider />');
      }
    }
    return value;
}

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setConnected] = useState(false);
    const { data } = useSession()
    const userId = data?.user.publicKey;
    useEffect(() => {
      console.log('WebSocketProvider: Initializing WebSocket...');
      const ws = new WebSocket(`ws://localhost:3000?userId=${userId}`);
  
      ws.onopen = () => {
        console.log('CONNECTED');
        setSocket(ws);
        setConnected(true);
      };
  
      ws.onclose = () => {
        console.log('DISCONNECTED');
        setSocket(null);
        setConnected(true);
      };
  
      return () => {
        console.log('WebSocketProvider: Initializing WebSocket...');
        ws.close();
      };
    }, []);
  
    return (
      <WebSocketContext.Provider value={{ isConnected, socket }}>
        {children}
      </WebSocketContext.Provider>
    );
  };