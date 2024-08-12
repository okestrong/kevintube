import { FC, useCallback, useMemo } from 'react';
import { APPBAR_HEIGHT } from '@/libs/vars';
import { Icon } from '@iconify-icon/react';
import AutoCompleteInput from '@/components/common/AutoCompleteInput';
import { clearToken } from '@/libs/utils';
import { useTheme } from 'next-themes';
import { useStore } from '@/libs/store';
import { usePathname, useRouter } from 'next/navigation';
import gravatar from 'gravatar';

interface Props {}

const AppHeader: FC<Props> = () => {
   const router = useRouter();
   const { systemTheme, theme, setTheme } = useTheme();
   const { clearMe, me } = useStore();
   const pathname = usePathname();
   const query = useMemo(() => {
      const paths = pathname.split('/');
      if (paths.length >= 4) {
         return decodeURI(paths[3]);
      }
      return '';
   }, [pathname]);

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

   const onSearch = useCallback((term: string) => router.push(`/youtube/search/${term}`), [pathname]);

   const gotoHome = useCallback(() => router.push('/home'), []);

   return (
      <header
         className="fixed bg-white dark:bg-neutral-800 top-0 inset-x-0 px-5 flex items-center justify-between border-b border-neutral-300 dark:border-neutral-500 shadow-md z-50"
         style={{ height: APPBAR_HEIGHT }}
      >
         <div className="flex space-x-2 items-center cursor-pointer z-10" onClick={gotoHome}>
            <Icon icon="logos:youtube-icon" className="text-2xl" />
            <span className="text-xl font-dohyun">KevinTube</span>
         </div>
         <div className="flex justify-end space-x-5">
            {me?.id && (
               <div className="flex flex-col items-center space-y-1">
                  <img src={gravatar.url(me!.email, { s: '30px', d: 'wavatar' })} width={30} className="rounded-full" />
                  <span className="text-xs">{me!.name}</span>
               </div>
            )}
            <button onClick={toggleTheme} className="hover:scale-125 transition-all">
               <Icon icon="line-md:light-dark" style={{ fontSize: 24 }} className="text-neutral-500 dark:text-neutral-100" />
            </button>
            <button onClick={onLogout} className="hover:scale-125 transition-all">
               <Icon icon="line-md:logout" style={{ fontSize: 24 }} className="text-neutral-500 dark:text-neutral-100" />
            </button>
         </div>
         {!pathname.startsWith('/home') && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[400px] lg:w-[600px]">
               <AutoCompleteInput onSearch={onSearch} defaultValue={query} />
            </div>
         )}
      </header>
   );
};

export default AppHeader;
