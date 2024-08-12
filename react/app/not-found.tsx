'use client';

import { ArrowBackOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function () {
   const router = useRouter();
   return (
      <div className="overflow-hidden">
         <div className="w-screen h-screen bg-white bg-[url(/images/preparing.jpg)] bg-no-repeat bg-center relative">
            <IconButton onClick={() => router.replace('/home')} className="absolute left-10 top-10 text-xl lg:text-7xl text-neutral-600 z-10 group">
               <ArrowBackOutlined fontSize="inherit" className="group-hover:scale-110" />
            </IconButton>
         </div>
      </div>
   );
}
