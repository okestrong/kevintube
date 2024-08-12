import axios, { type AxiosResponse } from 'axios';

export default defineNuxtPlugin(nuxtApp => {
   const baseURL = process.env.FRONT_API_URL;
   let refresh_token: Maybe<Promise<AxiosResponse<any, any>>> = null;

   const restApi = axios.create({
      baseURL,
      headers: {
         'Content-Type': 'application/json',
      },
   });

   const renewToken = () =>
      axios.get(`${baseURL}/renew-token`, {
         params: {
            refreshToken: localStorage.getItem('rtoken'),
         },
      });

   restApi.interceptors.request.use(config => {
      const at = localStorage.getItem('atoken');
      if (at) config.headers['Authorization'] = `Bearer ${at}`;
      else config.headers['Authorization'] = '';
      return config;
   });

   restApi.interceptors.response.use(
      (response: AxiosResponse) => {
         return response;
      },
      error => {
         const config = error.config;
         if (error.response && [401, 403].includes(error.response.status) && !config._retry) {
            if (!localStorage.getItem('rtoken')) {
               localStorage.removeItem('atoken');
               return Promise.reject(error);
            }

            config._retry = true;

            try {
               refresh_token = refresh_token ?? renewToken();
               refresh_token
                  .then((res: AxiosResponse) => {
                     localStorage.setItem('atoken', res.data.atoken);
                     localStorage.setItem('rtoken', res.data.rtoken);
                  })
                  .finally(() => {
                     refresh_token = null;
                     return restApi(config);
                  });
            } catch (err) {
               return Promise.reject(err);
            }
         }
         return Promise.reject(error);
      },
   );

   return {
      provide: {
         restApi,
      },
   };
});
