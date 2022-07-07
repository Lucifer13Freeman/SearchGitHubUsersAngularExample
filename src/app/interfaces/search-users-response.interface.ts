import { IUserShort } from "./user-short";

export interface ISearchUsersResponse {
  items: IUserShort[];
  incomplete_results: boolean;
  total_count: number;
}
