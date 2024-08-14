import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';
import { AxiosError, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { isArray } from 'lodash';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const extractPathname = (pathname: string) => {
   const modes = ['/view', '/edit', '/add'];
   if (!modes.some(it => pathname.includes(it))) {
      return {
         mode: 'list',
         id: undefined,
      };
   }
   const modeid = pathname.replace(/^.+?\/(view|edit|add)\/?(.*)$/g, '$1:$2');
   const arr = modeid?.split(':');
   return !arr
      ? { mode: 'list', id: undefined }
      : arr.length === 2
      ? {
           mode: arr[0],
           id: arr[1],
        }
      : {
           mode: arr[0],
           id: undefined,
        };
};

export const getPasswordStrength = (score: number): string => {
   switch (score) {
      case 0:
         return 'Fatal';
      case 1:
         return 'Danger';
      case 2:
         return 'Weak';
      case 3:
         return 'Good';
      case 4:
         return 'Great !';
      default:
         return '';
   }
};

export const gotoNewPath = (path: string, type?: 'push' | 'replace') => {
   if (typeof window === 'undefined') {
      return;
   }
   if (!type || type === 'push') {
      window.history.pushState(null, '', path);
   } else {
      window.history.replaceState(null, '', path);
   }
};

const phoneHeader = [
   '010',
   '011',
   '016',
   '017',
   '018',
   '019',
   '02',
   '051',
   '053',
   '032',
   '062',
   '042',
   '052',
   '044',
   '031',
   '033',
   '043',
   '041',
   '063',
   '061',
   '054',
   '055',
   '064',
   '010',
   '030',
   '050',
   '060',
   '070',
   '080',
];

export const phoneFormat = (value?: string): string => {
   if (!value) return '';

   let value1 = value.trim().replace(/\D/g, '');
   let value2 = '';
   let header = '';
   for (const head of phoneHeader) {
      const prefix = head;
      if (value.length > prefix.length && value1.startsWith(prefix)) {
         value1 = value1.substring(prefix.length);
         header = prefix;
         break;
      }
   }
   if (value1 && value1.length >= 7) {
      value2 = value1.substring(value1.length - 4);
      value1 = value1.slice(0, value1.length - 4);
   }
   if (header && value1) {
      header += '-';
   }
   if (value1 && value2) {
      value1 += '-';
   }
   return header + value1 + value2;
};

export const regexp = {
   email: /^[A-Z\d._%+-]+@[A-Z\d.-]+\.[A-Z]{2,4}$/i,
   url: /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i,
   path: /^\/[a-zA-Z0-9/]+$/,
};

export const matching = (type: string | RegExp) => {
   return type instanceof RegExp
      ? {
           onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
              const obj = e.target;
              const { value } = e.target;
              if (!type.test(value) && value.length > 1) {
                 const preVal = value.substring(0, value.length - 1);
                 if (!type.test(preVal)) {
                    obj.value = value.substring(0, preVal.length - 1);
                    return;
                 }
              }
              if (!type.test(value)) {
                 obj.value = value.substring(0, value.length - 1);
              }
           },
        }
      : type === 'numPointOnly'
      ? {
           onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
              const obj = e.target;
              obj.value = obj.value.replace(/[^\d.]/g, '');
              if (
                 (Boolean(obj.value) && obj.value.startsWith('0') && !obj.value.includes('.') && obj.value.length >= 2) ||
                 (obj.value.startsWith('.') && obj.value.length >= 2)
              ) {
                 obj.value = obj.value.slice(1);
              }
           },
        }
      : type === 'numOnly'
      ? {
           onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
              const obj = e.target;
              obj.value = obj.value.replace(/\D/g, '');
              if (Boolean(obj.value) && obj.value.startsWith('0') && obj.value.length >= 2) {
                 obj.value = obj.value.slice(1);
              }
           },
        }
      : type === 'numStringOnly'
      ? {
           onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
              const obj = e.target;
              obj.value = obj.value.replace(/\D/g, '');
           },
        }
      : type === 'idOnly'
      ? {
           onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
              const obj = e.target;
              const regex = /[^\da-zA-Z_-]/g;
              obj.value = obj.value.replace(regex, '').toLowerCase();
           },
        }
      : null;
};

export const saveToken = ({ data }: AxiosResponse): boolean => {
   if ('atoken' in data && 'rtoken' in data) {
      localStorage.setItem('atoken', data.atoken);
      localStorage.setItem('rtoken', data.rtoken);
      return true;
   } else {
      toast.warn('Token not found in Response');
      console.warn('Token not found in data', data);
      return false;
   }
};

export const clearToken = () => {
   localStorage.removeItem('atoken');
   localStorage.removeItem('rtoken');
};

export const showError = (e: AxiosError) => {
   const defaultErrMessage = `${e.response?.status || '[Unknown]'} : 처리중 오류가 발생했습니다`;
   const errors: string[] = [];
   let err = e.response?.data as any;
   if (typeof err === 'object') {
      for (const key of Object.keys(err)) {
         if (err[key] && typeof err[key] !== 'object' && String(err[key]).length > 0) {
            errors.push(err[key]);
         }
      }
   } else if (e.message) {
      errors.push(e.message);
   } else if (typeof e.response?.data === 'string') {
      errors.push(e.response.data);
   } else {
      errors.push(defaultErrMessage);
   }
   if (!!errors?.[0]) {
      toast(
         <div className="flex flex-col space-y-0.5">
            {errors.map(error => (
               <span key={error}>{error}</span>
            ))}
         </div>,
      );
   }
   return errors.reduce((acc, cur) => acc + '\n' + cur, '');
};

export const dateUtil = {
   getDateFromArray: (timestamp: number[]) =>
      new Date(
         dayjs(`${timestamp[0]}-${timestamp[1]}-${timestamp[2]} ${timestamp[3]}:${timestamp[4]}:${timestamp[5]}`, 'YYYY-M-D H:m:s').format(
            'YYYY-MM-DD HH:mm:ss',
         ),
      ),
   dateFormat: (timestamp: any, format?: string): string => {
      if (Array.isArray(timestamp) && timestamp.length === 7) {
         return dayjs(`${timestamp[0]}-${timestamp[1]}-${timestamp[2]} ${timestamp[3]}:${timestamp[4]}:${timestamp[5]}`, format || 'YYYY-M-D H:m:s').format(
            format || 'YYYY-MM-DD a H시 m분',
         );
      }
      return dayjs(timestamp).format(format || 'YYYY-MM-DD a H시 m분');
   },
   dateFormatFromNow: (timestamp: Date, format?: string): string => {
      let date = isArray(timestamp) ? dateUtil.getDateFromArray(timestamp) : new Date(timestamp);
      const now = new Date();
      if (dateUtil.dateDiff(now, date, 'day') < 30) {
         return dayjs(date).fromNow();
      }
      return dateUtil.dateFormat(timestamp, format);
   },
   dateDiff: (_date1: Date, _date2: Date, type: 'day' | 'hour' | 'min') => {
      let diff1 = _date1;
      let diff2 = _date2;
      diff1 = new Date(diff1.getFullYear(), diff1.getMonth() + 1, diff1.getDate());
      diff2 = new Date(diff2.getFullYear(), diff2.getMonth() + 1, diff2.getDate());
      let diff = Math.abs(diff2.getTime() - diff1.getTime());
      switch (type) {
         case 'day':
            diff = Math.ceil(diff / (1000 * 3600 * 24));
            break;
         case 'hour':
            diff = Math.ceil(diff / (1000 * 3600));
            break;
         case 'min':
            diff = Math.ceil(diff / (1000 * 60));
            break;
      }
      return diff;
   },
};

export const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);

export const randomDuration = () => Math.random() * 0.07 + 0.23;
