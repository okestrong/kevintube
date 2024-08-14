import axios, { AxiosInstance } from 'axios';

const restApi: AxiosInstance = axios.create({
   baseURL: process.env.API_URL,
   headers: {
      'Content-Type': 'application/vnd.react.v1+json',
   },
});

export default restApi;
