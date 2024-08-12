import { FC, useContext, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { GlobalContext } from '@/contexts/GlobalProvider';
import Colors from '@/libs/color';

interface MuiTextFieldProps {
   type: 'text' | 'textarea' | 'email' | 'number' | 'password';
   name?: string;
   placeholder?: string;
   id?: string;
   style: 'outline' | 'underline';
   label: string;
   inputClass?: string;
   [key: string]: any;
}

const MuiTextField: FC<MuiTextFieldProps> = ({ type, name, id, style, placeholder, label, inputClass, ...rest }) => {
   const { isDark } = useContext(GlobalContext)!;

   const borderColor = useMemo(() => (isDark ? Colors.neutral[300] : Colors.neutral[400]), [isDark]);
   const blueColor = useMemo(() => (isDark ? Colors.blue[300] : Colors.blue[500]), [isDark]);

   return (
      <div className="w-full">
         <div className={twMerge('w-full', style === 'outline' ? 'outlined-input' : 'standard-input')}>
            <input type={type} name={name} id={id || name} {...rest} className={twMerge('w-full', inputClass)} placeholder={placeholder || ' '} />
            <label htmlFor={id || name}>{label}</label>
         </div>
         <style jsx>{`
            .outlined-input {
               position: relative;
            }

            .outlined-input input {
               color: hsl(var(--foreground));
               height: 4rem !important;
               outline: 1px solid ${borderColor};
               //border: none;
               border-radius: 3px;
               background-color: hsl(var(--background));
               font-size: 16px;
               transition: 0.1s var(--main-ease);
               padding-left: 12px;
            }

            .outlined-input label {
               position: absolute;
               top: 50%;
               left: 12px;
               transform: translateY(-50%);
               background-color: hsl(var(--background));
               color: #757575;
               text-align: center;
               transition: 0.2s var(--main-ease);
               font-size: 15px;
               pointer-events: none;
               padding: 0 5px;
            }

            .outlined-input input:not(:placeholder-shown) ~ label,
            .outlined-input input:focus ~ label {
               top: 0;
               left: 10px;
               font-size: 1rem;
            }

            .outlined-input input:focus {
               outline: 1px solid ${blueColor} !important;
            }
            /*.outlined-input input:hover {
               outline: 1px solid var(--main-white);
            }*/
            .outlined-input input:focus ~ label {
               color: ${blueColor} !important;
            }
            /* END OUTLINED INPUT STYLES */

            /* STANDARD INPUT STYLES */
            .standard-input {
               position: relative;
            }

            .standard-input input {
               color: hsl(var(--foreground));
               height: 4rem;
               border: none;
               border-bottom: 1px solid ${borderColor};
               /*background-color: var(--main-dark-grey);*/
               padding-left: 20px;
               font-size: 20px;
               transition: 0.1s var(--main-ease);
               outline: none;
               box-sizing: border-box;
            }

            .standard-input label {
               position: absolute;
               top: 50%;
               left: 5%;
               transform: translateY(-50%);
               background-color: hsl(var(--background));
               color: rgba(255, 255, 255, 0.5);
               text-align: center;
               transition: 0.2s var(--main-ease);
               font-size: 1.5rem;
               pointer-events: none;
               padding: 0 5px;
            }

            .standard-input input:not(:placeholder-shown) ~ label,
            .standard-input input:focus ~ label {
               top: 0;
               left: 10px;
               font-size: 1rem;
            }

            .standard-input .underline {
               position: absolute;
               left: 0;
               right: 0;
               bottom: 0;
               transform: scaleX(0);
               transition: transform 0.2s var(--main-ease);
               border-bottom: 2px solid var(--main-blue);
            }

            .standard-input input:focus ~ .underline {
               transform: scaleX(1);
            }
            /*.standard-input input:hover {
               border-bottom: 2px solid var(--main-white);
            }*/
            .standard-input input:focus ~ label {
               color: var(--main-blue) !important;
            }
            /* END OF STANDARD INPUT STYLES */
         `}</style>
      </div>
   );
};

export default MuiTextField;
