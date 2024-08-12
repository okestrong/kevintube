import { FC, useEffect } from 'react';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import FormView from '@/components/common/form/FormView';
import { twMerge } from 'tailwind-merge';

interface FormInputProps {
   type?: string;
   mode?: string;
   register: UseFormRegisterReturn<any>;
   value?: string;
   setValue: UseFormSetValue<any>;
   [key: string]: any;
   classnames?: string;
   flexItems?: 'center' | 'start' | 'end';
}

const FormInput: FC<FormInputProps> = ({ type, mode, register, value, setValue, classnames, flexItems, ...rest }) => {
   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined' && register) {
         setValue(register.name, value);
      }
   }, [value, mode]);

   return (
      <FormView flexItems={mode !== 'view' ? flexItems : undefined}>
         {mode === 'view' ? (
            <div className="text-neutral-800 dark:text-neutral-300">{value}</div>
         ) : (
            <input type={type || 'text'} className={twMerge('w-full', classnames || '')} {...register} {...rest} />
         )}
      </FormView>
   );
};

export default FormInput;
