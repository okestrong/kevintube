import type { Metadata } from 'next';
import './globals.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-slidedown/lib/slidedown.css';
import { Do_Hyeon, Jua, Noto_Sans_KR, Poppins } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import { ThemeProvider } from '@/providers/theme-provider';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { GlobalProvider } from '@/contexts/GlobalProvider';
import { SenderProvider } from '@/contexts/SenderProvider';
import RQProvider from '@/providers/RQProvider';
import GlobalCssOverride from '@/styles/GlobalCssOverride';
import { headers } from 'next/headers';
import { WebSocketProvider } from '@/contexts/WebSocketProvider';

const notoSansKr = Noto_Sans_KR({
   // preload: true,  // 기본값 : true
   subsets: ['latin'],
   weight: ['100', '300', '400', '500', '700', '900'],
});
const dohyun = Do_Hyeon({
   subsets: ['latin'],
   weight: ['400'],
   variable: '--dohyun',
});
const jua = Jua({
   subsets: ['latin'],
   weight: ['400'],
   variable: '--jua',
});
const poppins = Poppins({
   subsets: ['latin'],
   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
   variable: '--poppins',
});

export const metadata: Metadata = {
   title: 'Okestro FE Code Leading',
   description: 'Okestro Contrabass FE team code leading demo project',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: ReactNode;
}>) {
   const header = headers();

   return (
      <html lang="en">
         <body className={twMerge(notoSansKr.className, dohyun.variable, jua.variable, poppins.variable)}>
            <GlobalCssOverride />
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
               <RQProvider>
                  <GlobalProvider isMobile={header.get('x-mobile') === 'mobile'}>
                     <WebSocketProvider>
                        <SenderProvider>{children}</SenderProvider>
                     </WebSocketProvider>
                  </GlobalProvider>
               </RQProvider>
            </ThemeProvider>
            <ToastContainer theme="dark" position="top-center" pauseOnHover closeButton autoClose={5000} limit={1} stacked />
         </body>
      </html>
   );
}
