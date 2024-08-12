export {};

declare global {
   type Maybe<T> = T | null | undefined;
}

declare module '*.vue' {
   import Vue from 'vue';
   export default Vue;
}

// app.vue 에서 useNuxtApp() 으로 가져온 nuxtApp.provide('hello', (msg) => ...); 을 정의한 경우에 아래 주석해제해야 $hello 쓸때 타입에러가 안난다.
/*declare module '#app' {
   interface NuxtApp {
      $hello(msg: string): string;
   }
}

declare module 'vue' {
   interface ComponentCustomProperties {
      $hello(msg: string): string;
   }
}*/
