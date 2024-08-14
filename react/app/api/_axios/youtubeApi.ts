import axios, { AxiosInstance } from 'axios';

const youtubeApi: AxiosInstance = axios.create({
   baseURL: 'https://www.googleapis.com/youtube/v3',
   params: {
      part: 'snippet',
      key: process.env.GOOGLE_API_KEY,
      type: 'video',
   },
});

export default youtubeApi;
