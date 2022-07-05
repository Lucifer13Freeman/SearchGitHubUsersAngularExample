import { IUser } from "./user.interface";

export interface IUsersListResponse
{
  items: IUser[];
  incomplete_results: boolean;
  total_count: number;
}
