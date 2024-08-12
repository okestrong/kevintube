import type { IUser } from '~/types/auth-types';

export const useSessionStore = defineStore(
   'session',
   () => {
      const me = ref();
      const setMe = (user: IUser) => {
         me.value = user;
      };
      const clearMe = () => (me.value = null);

      return { me, setMe, clearMe };
   },
   {
      persist: {
         storage: persistedState.sessionStorage, // persist: true 는 cookie 에 저장 (내부적으로 nuxt 의 useCookie 를 사용)
      },
   },
);
