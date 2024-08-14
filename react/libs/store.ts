import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IRemember, IUser } from '@/types/common/auth-types';
import { topSearch } from '@/libs/data';
import _ from 'lodash';

interface StoreProps {
   isAuthenticated: boolean;
   setMe: (me: IUser) => void;
   clearMe: () => void;
   me?: IUser;
   parentId: number;
   setParentId: (id: number) => void;
   lastSearchDatas: { [key: string]: any[] };
   deleteLastSearchData: (key: string) => void;
   clearSearchDatas: () => void;
   addSearchData: (key: string, data: any) => void;
   searchLock: boolean;
   setSearchLock: (flag: boolean) => void;
}

export const useStore = create<StoreProps>()(
   persist(
      set => ({
         isAuthenticated: false,
         setMe: (me: IUser) => set(_ => ({ me, isAuthenticated: !!me?.id })),
         clearMe: () => set(_ => ({ me: undefined, isAuthenticated: false })),
         me: undefined,
         parentId: 0,
         setParentId: (id: number) => set(_ => ({ parentId: id })),
         lastSearchDatas: {},
         deleteLastSearchData: (key: string) =>
            set(state => {
               delete state.lastSearchDatas[key];
               return state.lastSearchDatas;
            }),
         clearSearchDatas: () => set(_ => ({ lastSearchDatas: {} })),
         addSearchData: (key: string, data: any) =>
            set(stt => ({
               lastSearchDatas: { ...stt.lastSearchDatas, [key]: stt.searchLock ? stt.lastSearchDatas[key] : (stt.lastSearchDatas[key] || []).concat(data) },
            })),
         searchLock: false,
         setSearchLock: (flag: boolean) => set(_ => ({ searchLock: flag })),
      }),
      {
         name: 'session-storage',
         storage: createJSONStorage(() => sessionStorage),
      },
   ),
);

interface PersistProps {
   remember?: IRemember;
   setRemember: (me: IRemember) => void;
   items: string[];
   addItem: (item: string) => void;
}
export const usePersist = create<PersistProps>()(
   persist(
      set => ({
         remember: undefined,
         setRemember: (me: IRemember) => set(_ => ({ remember: me })),
         items: topSearch,
         addItem: (item: string) => set(state => ({ items: _.uniq(state.items.concat(item)) })),
      }),
      {
         name: 'local-storage',
         storage: createJSONStorage(() => localStorage),
      },
   ),
);
