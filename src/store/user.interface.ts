export type TUserRole = "admin" | "user" | "super"

export interface IUser {
  id?: string;
  email: string | null;
  name: string | null;
  role?: TUserRole;
  photo: string | null;
}

export interface IUserStore {
  user: IUser | null;
  isLoading: boolean;
}
