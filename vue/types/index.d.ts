import type { AxiosInstance } from 'axios';

declare module '#app' {
   interface NuxtApp {
      $hello(msg: string): string;
      $restApi: AxiosInstance;
   }
}

declare module 'vue' {
   interface ComponentCustomProperties {
      $hello(msg: string): string;
      $restApi: AxiosInstance;
   }
}

declare module 'unescape' {
   function unescape(str: string, type?: 'all' | 'default' | 'extras'): string;
   namespace unescape {
      export let chars: { [key: string]: string };
      export let extras: { [key: string]: string };
   }

   export = unescape;
}
