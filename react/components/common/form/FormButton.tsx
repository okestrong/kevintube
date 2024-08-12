import React, { FC, ReactNode } from 'react';
import { Icon } from '@iconify-icon/react';

interface FormButtonProps {
   children?: ReactNode | ReactNode[];
   icon?: string;
   label?: string;
   onClick?: () => void;
   type: 'submit' | 'reset' | 'button';
}

const FormButton: FC<FormButtonProps> = ({ icon, label, children, onClick, type }) => {
   return (
      <button
         type={type}
         className="bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600 h-[34px] w-[80px] min-w-fit px-2 rounded-sm flex items-center space-x-1 justify-center"
         onClick={onClick}
      >
         {icon && <Icon icon={icon} style={{ fontSize: 18 }} />}
         {label && <span>{label}</span>}
         {!icon && !label && children}
      </button>
   );
};

export default FormButton;
