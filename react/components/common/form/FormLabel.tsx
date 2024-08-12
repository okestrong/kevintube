'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { extractPathname } from '@/libs/utils';
import { DEFAULT_LABEL_WIDTH } from '@/libs/vars';

interface FormLabelProps {
   maxWidth?: number;
   label: string;
   inputId?: string;
   required?: boolean;
   classNames?: string;
   forceMode?: string;
}

const FormLabel: FC<FormLabelProps> = ({ maxWidth, label, inputId, required, classNames, forceMode }) => {
   const { mode } = extractPathname(usePathname());

   return (
      <>
         <label
            htmlFor={inputId}
            className={twMerge(
               'text-neutral-800 dark:text-neutral-200 font-bold form-label flex items-center bg-gradient-to-l from-transparent to-blue-50 dark:to-slate-600 dark:from-0% rounded-l-md',
               (forceMode || mode) !== 'view' && Boolean(required) && 'required',
               classNames || '',
            )}
         >
            {/*<Icon icon="twemoji:moai" style={{ fontSize: 14 }} />*/}
            <span className="overflow-hidden whitespace-nowrap text-ellipsis text-right pr-4">{label}&nbsp;:</span>
         </label>
         <style jsx>{`
            .form-label {
               height: 34px;
               position: relative;
               white-space: nowrap;
               overflow-x: hidden;
               text-overflow: ellipsis;
               & > span {
                  width: ${maxWidth || DEFAULT_LABEL_WIDTH}px;
                  max-width: ${maxWidth || DEFAULT_LABEL_WIDTH}px;
               }
            }
            .form-label.required:after {
               content: '*';
               position: absolute;
               right: 4px;
               top: 2px;
               color: tomato;
            }
         `}</style>
      </>
   );
};

export default FormLabel;
