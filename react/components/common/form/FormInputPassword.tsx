import { FC, useEffect } from 'react';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import FormView from '@/components/common/form/FormView';
import { twMerge } from 'tailwind-merge';
import { getPasswordStrength } from '@/libs/utils';

interface FormInputProps {
   score: number;
   mode?: string;
   register: UseFormRegisterReturn<any>;
   value?: string;
   setValue: UseFormSetValue<any>;
   [key: string]: any;
   classnames?: string;
   flexItems?: 'center' | 'start' | 'end';
}

const FormInputPassword: FC<FormInputProps> = ({ type, mode, score, register, value, setValue, classnames, flexItems, ...rest }) => {
   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined' && register) {
         setValue(register.name, value);
      }
   }, [value, mode]);

   return (
      <FormView flexItems={mode !== 'view' ? flexItems : undefined}>
         {mode === 'view' ? (
            <div className="text-neutral-800 dark:text-neutral-300">Password is hidden</div>
         ) : (
            <div className="w-full relative">
               <input type="password" className={twMerge('w-full', classnames || '')} {...register} {...rest} style={{ paddingRight: '80px !important' }} />
               <div
                  className={twMerge(
                     'absolute right-0 inset-y-0 flex justify-center items-center w-[70px] pointer-events-none my-[1px] mr-[1px] text-white',
                     score > 2 ? 'bg-green-500' : score > -1 ? 'bg-red-400' : 'bg-transparent',
                  )}
               >
                  {getPasswordStrength(score)}
               </div>
            </div>
         )}
      </FormView>
   );
};

export default FormInputPassword;
