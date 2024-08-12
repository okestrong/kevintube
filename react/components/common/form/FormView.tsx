import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormViewProps {
   children: string | ReactNode | ReactNode[];
   flexItems?: 'center' | 'start' | 'end';
}

const FormView: FC<FormViewProps> = ({ children, flexItems }) => {
   return (
      <div className={twMerge('form-view flex flex-1 text-neutral-500 dark:text-neutral-200', flexItems ? `items-${flexItems}` : 'items-center')}>
         {children}
      </div>
   );
};

export default FormView;
