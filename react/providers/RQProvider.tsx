'use client';

import { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface RqProps {
   children: ReactNode | ReactNode[];
}

const ReactQueryDevtoolsProduction = lazy(() =>
   import('@tanstack/react-query-devtools/build/modern/production.js').then(d => ({
      default: d.ReactQueryDevtools,
   })),
);

function RQProvider({ children }: RqProps) {
   // production 모드에서 React Query Devtool 사용하려면 기본값을 true 로.
   const [showDev, setShowDev] = useState(false);
   useEffect(() => {
      // @ts-ignore
      window.toggleDevtools = () => setShowDev(prev => !prev);
      // ▶︎ production 모드에서도, 콘솔에서 window.toggleDevtools() 를 쳐서 ReactQueryDevtools 를 로드할 수 있음.
      // ▶ [참고] https://tanstack.com/query/v4/docs/framework/react/devtools
   }, []);

   const [client] = useState(
      new QueryClient({
         defaultOptions: {
            queries: {
               refetchOnWindowFocus: false,
               retryOnMount: true,
               refetchOnReconnect: false,
               retry: false,
            },
         },
      }),
   );

   return (
      <QueryClientProvider client={client}>
         {children}
         <ReactQueryDevtools initialIsOpen={showDev} />
         {showDev && (
            <Suspense fallback={null}>
               <ReactQueryDevtoolsProduction />
            </Suspense>
         )}
      </QueryClientProvider>
   );
}

export default RQProvider;
