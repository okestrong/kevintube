import _ from 'lodash';
import { topSearch } from '~/helpers/data';

export const useItemStore = defineStore(
   'item',
   () => {
      const items = ref<string[]>(topSearch);

      const addItem = (item: string) => {
         items.value = _.uniq(items.value.concat(item));
      };

      return { items, addItem };
   },
   {
      persist: {
         storage: persistedState.localStorage,
      },
   },
);
