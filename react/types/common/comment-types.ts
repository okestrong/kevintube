import { IUser } from '@/types/common/auth-types';

export interface IComment {
   id: number;
   content: string;
   userId: number;
   videoId: string;
   user: IUser;
   createdAt: Date;
   updatedAt?: Date;
   deletedAt?: Date;
   isdelete: boolean;
   ref: number;
   childCnt: number;
   lev: number;
   step: number;
}

export interface InfinitePaging<T> {
   skip: number;
   list: T[];
   total: number;
}
