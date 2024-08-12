import { FC, useCallback, useEffect, useMemo } from 'react';
import { APPBAR_HEIGHT, shakeScaleVariants } from '@/libs/vars';
import { Icon } from '@iconify-icon/react';
import { clearToken } from '@/libs/utils';
import { useTheme } from 'next-themes';
import { useStore } from '@/libs/store';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';

interface Props {}

const HomeHeader: FC<Props> = () => {
   const router = useRouter();
   const { systemTheme, theme, setTheme } = useTheme();
   const { clearMe } = useStore();
   const pathname = usePathname();
   const controls = useAnimation();

   const query = useMemo(() => {
      const paths = pathname.split('/');
      if (paths.length >= 4) {
         return decodeURI(paths[3]);
      }
      return '';
   }, [pathname]);

   useEffect(() => {
      const timer1 = window.setInterval(() => {
         controls.start('start');
      }, 1000);

      const timer2 = window.setInterval(
         () => {
            controls.stop();
            controls.set('reset');
         },
         Math.floor(Math.random() * (10 - 2) + 2) * 1000,
      );

      return () => {
         if (timer1) window.clearInterval(timer1);
         if (timer2) window.clearInterval(timer2);
         controls.stop();
      };
   }, []);

   const toggleTheme = useCallback(() => {
      if (theme === 'system') {
         setTheme(systemTheme === 'dark' ? 'light' : 'dark');
      } else {
         setTheme(theme === 'dark' ? 'light' : 'dark');
      }
   }, [theme, systemTheme]);

   const onLogout = useCallback(() => {
      clearToken();
      clearMe();
   }, []);

   const gotoHome = useCallback(() => router.push('/home'), []);

   return (
      <header className="fixed top-0 inset-x-0 pr-5 h-[200px]">
         <div className="app-bar"></div>
         <div className="fixed top-12 left-1/2 -translate-x-1/2 rounded-t-lg w-[200px]">
            <motion.div
               custom={Math.floor(Math.random() * (10 - 1) + 1)}
               variants={shakeScaleVariants}
               animate={controls}
               className="border-4 border-b-[14px] border-black rounded-t-lg shadow-xlarge"
            >
               <Icon icon="openmoji:youtube" className="text-4xl absolute left-1 top-1" />
               <video autoPlay muted loop className="object-cover">
                  <source src="/videos/baloon.mp4" type="video/mp4" />
               </video>
            </motion.div>
         </div>
         <div className="absolute w-full top-0 flex items-center justify-between px-5" style={{ height: APPBAR_HEIGHT }}>
            <div className="flex space-x-2 items-center cursor-pointer z-10" onClick={gotoHome}>
               <Icon icon="logos:youtube-icon" className="text-4xl" />
               <span className="text-3xl font-dohyun">KevinTube</span>
            </div>
            <div className="flex justify-end space-x-5">
               <button onClick={toggleTheme} className="hover:scale-125 transition-all">
                  <Icon icon="line-md:light-dark" style={{ fontSize: 24 }} className="text-neutral-200" />
               </button>
               <button onClick={onLogout} className="hover:scale-125 transition-all">
                  <Icon icon="line-md:logout" style={{ fontSize: 24 }} className="text-neutral-200" />
               </button>
            </div>
         </div>
      </header>
   );
};

export default HomeHeader;
