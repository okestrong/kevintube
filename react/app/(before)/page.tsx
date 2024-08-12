'use client';

import { NextPage } from 'next';
import { useStore } from '@/libs/store';
import { useRouter } from 'next/navigation';
import Main from '@/app/(before)/_component/Main';

const IndexPage: NextPage = () => {
   const router = useRouter();
   const { isAuthenticated } = useStore();
   if (isAuthenticated) {
      router.push('/home');
   } else {
      router.push('/flow/login');
   }
   return <Main />;
};

export default IndexPage;
