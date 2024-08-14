import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { clearToken, gotoNewPath } from '@/libs/utils';

const Sender: AxiosInstance = axios.create({
   baseURL: '/api/rest',
   headers: {
      'Content-Type': 'application/json',
   },
});

Sender.interceptors.request.use(config => {
   const at = localStorage.getItem('atoken');
   if (at) config.headers['Authorization'] = `Bearer ${at}`;
   else config.headers['Authorization'] = '';
   return config;
});

const renewToken = () => {
   return axios.get('/api/rest/renew-token', {
      params: {
         refreshToken: localStorage.getItem('rtoken'),
      },
   });
};

let refresh_token: Maybe<Promise<AxiosResponse<any, any>>> = null;

Sender.interceptors.response.use(
   (response: AxiosResponse) => {
      return response;
   },
   error => {
      const config = error.config;
      if (error.response && error.response.status === 410) {
         clearToken();
         gotoNewPath('/');
      } else if (error.response && [401, 403].includes(error.response.status || error.response.data?.errorCode) && !config._retry) {
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

export default Sender;
