import React, { FC, useEffect } from 'react';
import { Controller, UseFormSetValue } from 'react-hook-form';
import FormView from '@/components/common/form/FormView';

interface FormRadioProps {
   mode?: string;
   name: string;
   groups: { label: string; value: any; id: string }[];
   value?: any;
   [key: string]: any;
   control: any;
   setValue: UseFormSetValue<any>;
   rules?: any;
   onRadioChange?: (value: any) => void;
}

const FormRadio: FC<FormRadioProps> = ({ mode, name, groups, value, setValue, control, rules, onRadioChange, ...rest }) => {
   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined') {
         setValue(name, value);
      }
   }, [mode, value]);

   return (
      <FormView>
         {mode === 'view' ? (
            <div>{(groups.find(g => g.value === value) || {}).label || value}</div>
         ) : (
            <Controller
               render={props => (
                  <>
                     {groups.map(g => (
                        <div className="inline-flex items-center" key={`${g.id}-${g.value}`}>
                           <input
                              type="radio"
                              id={g.id}
                              onBlur={props.field.onBlur}
                              onChange={() => {
                                 if (typeof onRadioChange === 'function') {
                                    onRadioChange(g.value);
                                 }
                                 props.field.onChange(g.value);
                              }}
                              checked={props.field.value === g.value}
                              ref={props.field.ref}
                           />
                           <label htmlFor={g.id} className="pr-3">
                              {g.label}
                           </label>
                        </div>
                     ))}
                  </>
               )}
               name={name}
               control={control}
               rules={rules}
               defaultValue={value}
            />
         )}
      </FormView>
   );
};

export default FormRadio;
