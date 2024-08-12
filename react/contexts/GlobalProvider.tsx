'use client';

import { createContext, PropsWithChildren, useMemo } from 'react';
import { useTheme } from 'next-themes';

type GlobalProviderProps = {
   isDark: boolean;
   isMobile: boolean;
};

interface Props extends PropsWithChildren {
   isMobile: boolean;
}

export const GlobalContext = createContext<Maybe<GlobalProviderProps>>(null);

export const GlobalProvider = ({ isMobile, children }: Props) => {
   const { theme, systemTheme } = useTheme();
   const isDark = useMemo(() => (theme === 'system' && systemTheme === 'dark') || theme === 'dark', [theme, systemTheme]);

   return <GlobalContext.Provider value={{ isDark, isMobile }}>{children}</GlobalContext.Provider>;
};
