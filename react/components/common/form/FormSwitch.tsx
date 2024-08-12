import React, { FC, useEffect } from 'react';
import { Controller, UseFormSetValue } from 'react-hook-form';
import FormView from '@/components/common/form/FormView';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FormSwitchProps {
   mode?: string;
   name: string;
   value?: boolean;
   setValue: UseFormSetValue<any>;
   okLabel: string;
   noLabel: string;
   disabled?: boolean;
   control: any;
   rules?: any;
   [key: string]: any;
}

const FormSwitch: FC<FormSwitchProps> = ({ mode, name, value, setValue, okLabel, noLabel, disabled, control, rules, ...rest }) => {
   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined') {
         setValue(name, value);
      }
   }, [mode, value]);

   return (
      <FormView>
         {mode === 'view' ? (
            <div>{value === true ? okLabel : noLabel}</div>
         ) : (
            <Controller
               render={props => (
                  <div>
                     <Switch id={name} onChange={props.field.onChange} checked={props.field.value} disabled={disabled} {...rest} />
                     <Label htmlFor={name}>{value === true ? okLabel : noLabel}</Label>
                  </div>
               )}
               name={name}
               control={control}
               rules={rules}
            />
         )}
      </FormView>
   );
};

export default FormSwitch;
