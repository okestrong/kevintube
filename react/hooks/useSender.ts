import axios, { AxiosResponse } from 'axios';
import { useCallback, useMemo } from 'react';

export interface SenderProps {
   baseURL: string;
   params?: { [key: string]: any };
   headers?: { [key: string]: string };
}

export default function useSender({ baseURL, params, headers }: SenderProps) {
   let refresh_token: Maybe<Promise<AxiosResponse<any, any>>> = null;

   const renewToken = useCallback(() => {
      return axios.get(`${baseURL}/renew-token`, {
         params: {
            refreshToken: localStorage.getItem('rtoken'),
         },
      });
   }, [baseURL]);

   const Sender = useMemo(() => {
      const instance = axios.create({
         baseURL,
         params,
         headers,
      });
      instance.interceptors.request.use(config => {
         const at = localStorage.getItem('atoken');
         if (at) config.headers['Authorization'] = `Bearer ${at}`;
         else config.headers['Authorization'] = '';
         return config;
      });

      instance.interceptors.response.use(
         (response: AxiosResponse) => {
            return response;
         },
         error => {
            const config = error.config;
            console.log('error=', error);
            console.log('error.response.data=', error.response.data);
            if (error.response && [401, 403].includes(error.response.status) && !config._retry) {
               if (!localStorage.getItem('rtoken')) {
                  localStorage.removeItem('atoken');
                  return Promise.reject(error);
               }

               config._retry = true;

               try {
                  refresh_token = refresh_token ? refresh_token : renewToken();
                  refresh_token
                     .then((res: AxiosResponse) => {
                        localStorage.setItem('atoken', res.data.atoken);
                        localStorage.setItem('rtoken', res.data.rtoken);
                     })
                     .finally(() => {
                        refresh_token = null;
                        return Sender(config);
                     });
               } catch (err) {
                  return Promise.reject(err);
               }
            }
            return Promise.reject(error);
         },
      );

      return instance;
   }, [baseURL, params, renewToken]);

   return { Sender };
}
