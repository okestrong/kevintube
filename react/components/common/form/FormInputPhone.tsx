import React, { FC, useCallback, useEffect, useState } from 'react';
import { Controller, UseFormSetValue } from 'react-hook-form';
import FormView from '@/components/common/form/FormView';
import { matching, phoneFormat } from '@/libs/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { twMerge } from 'tailwind-merge';

interface FormInputPhoneProps {
   mode?: string;
   control: any;
   name: string;
   value?: string;
   setValue: UseFormSetValue<any>;
   [key: string]: any;
   classnames?: string;
   flexItems?: 'center' | 'start' | 'end';
}

const FormInputPhone: FC<FormInputPhoneProps> = ({ name, control, mode, value, setValue, classnames, flexItems, ...rest }) => {
   const [val, setVal] = useState(value);
   const [focused, setFocused] = useState(false);

   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined') {
         setValue(name, value);
      }
   }, [value, mode]);

   const onChangeNumber = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value), []);

   return (
      <FormView flexItems={mode !== 'view' ? flexItems : undefined}>
         {mode === 'view' ? (
            <div className="text-neutral-800 dark:text-neutral-300">{phoneFormat(value)}</div>
         ) : (
            <TooltipProvider>
               <Controller
                  render={props => (
                     <Tooltip open={Boolean(val) && focused}>
                        <TooltipTrigger asChild>
                           <input
                              type="text"
                              className={twMerge('w-full', classnames || '')}
                              defaultValue={value}
                              {...rest}
                              placeholder="- 기호 없이 숫자만 입력하세요"
                              maxLength={12}
                              onChange={e => {
                                 onChangeNumber(e);
                                 props.field.onChange(e.target.value);
                              }}
                              {...matching('numStringOnly')}
                              autoComplete="off"
                              onFocus={() => setFocused(true)}
                              onBlur={() => setFocused(false)}
                           />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-full flex justify-start dark:bg-white">
                           <p className="text-blue-600 dark:text-blue-400 text-xl">{phoneFormat(val)}</p>
                        </TooltipContent>
                     </Tooltip>
                  )}
                  name={name}
                  control={control}
               />
            </TooltipProvider>
         )}
      </FormView>
   );
};

export default FormInputPhone;
