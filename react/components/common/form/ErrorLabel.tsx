import { Message } from 'react-hook-form';
import SlideDown from 'react-slidedown';
import { twJoin } from 'tailwind-merge';
import { DEFAULT_LABEL_WIDTH } from '@/libs/vars';
import { usePathname } from 'next/navigation';
import { extractPathname } from '@/libs/utils';
import { useContext, useMemo } from 'react';
import { GlobalContext } from '@/contexts/GlobalProvider';

interface ErrorProps {
   label?: Message | string;
   formLabelWidth?: number;
   forceMode?: string;
   classNames?: string;
   [key: string]: any;
}

const ErrorLabel = ({ label, classNames, forceMode, formLabelWidth, ...rest }: ErrorProps) => {
   const pathname = usePathname();
   const { mode } = extractPathname(pathname);
   const ctx = useContext(GlobalContext);
   const isdark = useMemo(() => ctx?.isDark, [ctx]);

   return (
      <SlideDown className="w-full">
         {Boolean(label) && (forceMode || mode) !== 'view' && (
            <div className="w-full" style={{ paddingLeft: typeof formLabelWidth !== 'number' ? DEFAULT_LABEL_WIDTH + 4 : formLabelWidth }}>
               <small className={twJoin('text-red-500 text-[13px]', isdark && 'text-red-400', Boolean(classNames) && classNames)} {...rest}>
                  {label}
               </small>
            </div>
         )}
      </SlideDown>
   );
};

export default ErrorLabel;
