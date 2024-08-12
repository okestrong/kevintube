'use client';

import axios, { AxiosInstance } from 'axios';
import { createContext, ReactNode } from 'react';
import useSender from '@/hooks/useSender';

type SenderProviderProps = {
   youtubeApi: AxiosInstance;
   restApi: AxiosInstance;
};

export const SenderContext = createContext<Maybe<SenderProviderProps>>(null);

export const SenderProvider = ({ children }: { children: ReactNode }) => {
   const youtubeApi = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      params: {
         part: 'snippet',
         maxResults: 20,
         key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
         type: 'video',
      },
   });

   const { Sender: restApi } = useSender({
      baseURL: process.env.NEXT_PUBLIC_API_URL as string,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Content-Type': 'application/vnd.react.v1+json',
      },
   });

   return (
      <SenderContext.Provider
         value={{
            youtubeApi,
            restApi,
         }}
      >
         {children}
      </SenderContext.Provider>
   );
};
