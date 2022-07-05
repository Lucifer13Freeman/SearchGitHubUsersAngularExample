import { IUser } from "./user.interface";

export interface ISearchUsersResponse
{
  items: IUser[];
  incomplete_results: boolean;
  total_count: number;
}
