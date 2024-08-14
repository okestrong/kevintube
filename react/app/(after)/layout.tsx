'use client';

import { NextPage } from 'next';
import { PropsWithChildren, useCallback, useContext, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Icon } from '@iconify-icon/react';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken, showError } from '@/libs/utils';
import { useStore } from '@/libs/store';
import { APPBAR_HEIGHT } from '@/libs/vars';
import AutoCompleteInput from '@/components/common/AutoCompleteInput';
import AppHeader from '@/app/(after)/_component/AppHeader';
import HomeHeader from '@/app/(after)/_component/HomeHeader';
import { twMerge } from 'tailwind-merge';
import { SenderContext } from '@/contexts/SenderProvider';
import tokenApi from '@/libs/tokenApi';

const AfterLayout: NextPage = ({ children }: PropsWithChildren) => {
   const pathname = usePathname();
   const router = useRouter();
   const { isAuthenticated, setMe, clearSearchDatas } = useStore();

   if (!isAuthenticated) {
      if (typeof window !== 'undefined' && localStorage.getItem('atoken')) {
         tokenApi
            .get(`/me`)
            .then(res => setMe(res.data))
            .catch(showError);
      } else {
         router.push('/');
      }
   }

   useEffect(() => {
      if (pathname === '/home') {
         clearSearchDatas();
      }
   }, [pathname]);

   return (
      <div className={twMerge('h-screen', pathname === '/home' && 'overflow-y-hidden')}>
         {pathname === '/home' ? <HomeHeader /> : <AppHeader />}
         <div className="w-full" style={{ minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`, marginTop: APPBAR_HEIGHT }}>
            {children}
         </div>
      </div>
   );
};

export default AfterLayout;
