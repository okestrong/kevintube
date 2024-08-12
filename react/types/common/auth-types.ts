export interface IRemember {
   username: string;
   loginAt?: Date;
}

export interface IUser extends Omit<IRemember, 'loginAt'> {
   id: number;
   password?: string;
   email: string;
   phone: string;
   name: string;
   role: string;
   avatar?: string;
   isdelete: boolean;
   islogin: boolean;
}
