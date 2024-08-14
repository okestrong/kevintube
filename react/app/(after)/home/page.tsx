'use client';

import { NextPage } from 'next';
import React, { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AutoCompleteInput from '@/components/common/AutoCompleteInput';

const HomePage: NextPage = () => {
   const router = useRouter();
   const onSearch = useCallback((term: string) => {
      router.push(`/youtube/search/${term}`);
   }, []);

   return (
      <>
         <div className="w-full h-screen flex flex-col items-center justify-center paper relative">
            <div className="ocean">
               <div className="wave" />
               <div className="wave" />
            </div>
         </div>
         <div className="w-[400px] lg:w-[600px] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <AutoCompleteInput autoFocus onSearch={onSearch} />
         </div>
         <style jsx>{`
            .paper {
               background: radial-gradient(ellipse at center, rgba(255, 254, 234, 1) 0%, rgba(255, 254, 234, 1) 35%, #b7e8eb 100%);
               overflow: hidden;
               z-index: -1;
            }
         `}</style>
      </>
   );
};

export default HomePage;
