import { FC, useContext, useEffect, useState } from 'react';
import { Controller, UseFormSetValue } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { GlobalContext } from '@/contexts/GlobalProvider';
import FormView from '@/components/common/form/FormView';
import { TextareaAutosize } from '@mui/material';
import Colors from '@/libs/color';

interface FormInputProps {
   mode?: string;
   name: string;
   control: any;
   minRows?: number;
   value?: string;
   setValue: UseFormSetValue<any>;
   classnames?: string;
   flexItems?: 'center' | 'start' | 'end';
   [key: string]: any;
}

const FormTextarea: FC<FormInputProps> = ({ minRows, mode, name, control, value, setValue, classnames, flexItems, ...rest }) => {
   const { isDark } = useContext(GlobalContext)!;

   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined') {
         setValue(name, value);
      }
   }, [value, mode]);

   return (
      <FormView flexItems={mode !== 'view' ? flexItems : undefined}>
         {mode === 'view' ? (
            <div className="dark:text-neutral-300 text-neutral-600 whitespace-pre-wrap break-words">{value}</div>
         ) : (
            <Controller
               render={props => (
                  <TextareaAutosize
                     id={name}
                     defaultValue={value}
                     value={props.field.value}
                     minRows={minRows || 2}
                     className={twMerge('auto-textarea rounded-sm w-full', classnames || '')}
                     onChange={e => {
                        props.field.onChange(e);
                     }}
                     {...rest}
                  />
               )}
               name={name}
               control={control}
            />
         )}
         <style jsx global>{`
            .auto-textarea {
               padding: 8px;
               border: 1px solid ${isDark ? Colors.neutral[400] : Colors.neutral[200]};
            }
         `}</style>
      </FormView>
   );
};

export default FormTextarea;
