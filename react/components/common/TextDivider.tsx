import React, { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextDividerProps {
   label?: string | ReactNode | ReactNode[];
   classnames?: string;
   textClassnames?: string;
}

const TextDivider: FC<TextDividerProps> = ({ label, classnames, textClassnames }) => {
   return (
      <div className={twMerge('w-full h-[1px] border-b border-solid border-neutral-200 relative', classnames || '')}>
         <span className={twMerge('divider-bg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3', textClassnames || '')}>{label}</span>
         <style jsx>{`
            .divider-bg {
               background: hsl(var(--background));
            }
         `}</style>
      </div>
   );
};

export default TextDivider;
