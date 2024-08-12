import React, { FC } from 'react';
import { twJoin } from 'tailwind-merge';

interface FormRowProps {
   classnames?: string;
   children: React.ReactNode | React.ReactNode[];
   colSpan?: ('lg:2' | '2xl:2' | '2xl:3')[] | 'full';
}

const FormRow: FC<FormRowProps> = ({ colSpan, classnames, children }) => {
   return (
      <div
         className={twJoin(
            'flex items-start flex-wrap w-full',
            colSpan?.includes('lg:2') && 'lg:col-span-2',
            colSpan?.includes('2xl:2') && '2xl:col-span-2',
            colSpan?.includes('2xl:3') && '2xl:col-span-3',
            colSpan === 'full' && 'lg:col-span-2 2xl:col-span-3',
            classnames || '',
         )}
      >
         {children}
      </div>
   );
};

export default FormRow;
