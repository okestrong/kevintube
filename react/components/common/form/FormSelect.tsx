import { FC, useEffect } from 'react';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import FormView from '@/components/common/form/FormView';

interface FormSelectProps {
   mode?: string;
   register: UseFormRegisterReturn<any>;
   value?: string;
   setValue: UseFormSetValue<any>;
   options: { label: any; value: any }[];
   [key: string]: any;
}

const FormSelect: FC<FormSelectProps> = ({ mode, register, options, value, setValue, ...rest }) => {
   useEffect(() => {
      if (mode === 'edit' && typeof value !== 'undefined') {
         setValue(register.name, value);
      }
   }, [value, mode]);

   return (
      <FormView>
         {mode === 'view' ? (
            <div className="text-neutral-800">{value}</div>
         ) : (
            <select {...register} {...rest} style={{ width: 'fit-content', minWidth: 150, maxWidth: '100%' }}>
               {options.map((opt, idx) => (
                  <option key={`${idx}_${opt.value}`} value={opt.value}>
                     {opt.label}
                  </option>
               ))}
            </select>
         )}
      </FormView>
   );
};

export default FormSelect;
