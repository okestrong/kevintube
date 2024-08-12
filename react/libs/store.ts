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
}

export const useStore = create<StoreProps>()(set => ({
   isAuthenticated: false,
   setMe: (me: IUser) => set(_ => ({ me, isAuthenticated: !!me?.id })),
   clearMe: () => set(_ => ({ me: undefined })),
   me: undefined,
   parentId: 0,
   setParentId: (id: number) => set(_ => ({ parentId: id })),
}));

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
