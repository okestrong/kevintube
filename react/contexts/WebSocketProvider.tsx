'use client';

import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useQueryClient } from '@tanstack/react-query';

type WebSocketProviderProps = {
   cmtSocket: Maybe<ReconnectingWebSocket>;
};

export const WebSocketContext = createContext<WebSocketProviderProps | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
   const [cmtSocket, setCmtSocket] = useState<ReconnectingWebSocket | null>(null);
   const client = useQueryClient();

   useEffect(() => {
      const sk = new ReconnectingWebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/cmt`);
      sk.onopen = () => console.log('WebSocket server connected');
      sk.onclose = () => console.log(`Websocket connection is closed !`);
      sk.onerror = (err: any) => {
         console.log(`Websocket error : ${err}`);
         console.error(err);
      };
      sk.onmessage = (e: MessageEvent) => {
         const videoId = e.data;
         client.invalidateQueries({
            queryKey: ['youtube', 'comments', videoId],
         });
      };
      setCmtSocket(sk);
      /*return () => {
         cmtSocket?.close();
      };*/
   }, []);

   return (
      <WebSocketContext.Provider
         value={{
            cmtSocket,
         }}
      >
         {children}
      </WebSocketContext.Provider>
   );
};
