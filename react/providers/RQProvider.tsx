'use client';

import { lazy, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface RqProps {
   children: ReactNode | ReactNode[];
}

const ReactQueryDevtoolsProduction = lazy(() =>
   import('@tanstack/react-query-devtools/build/modern/production.js').then(d => ({
      default: d.ReactQueryDevtools,
   })),
);

function RQProvider({ children }: RqProps) {
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

   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default RQProvider;
