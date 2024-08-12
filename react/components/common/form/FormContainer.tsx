import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormContainerProps {
   children: ReactNode;
   classnames?: string;
}

const FormContainer: FC<FormContainerProps> = ({ children, classnames }) => {
   return <div className={twMerge('grid lg:grid-cols-2 2xl:grid-cols-3 gap-2', classnames || '')}>{children}</div>;
};

export default FormContainer;
