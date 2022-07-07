import { ISearchUsersResponse } from "src/app/interfaces/search-users-response.interface";

export const findOneUserText: string = "Lucifer13Freeman";
export const findNoOneUserText: string = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

export const searchOneUserMock: ISearchUsersResponse = {
    incomplete_results: false,
    items: [{
      avatar_url: "https://avatars.githubusercontent.com/u/78305978?v=4",
      html_url: "https://github.com/Lucifer13Freeman",
      id: 78305978,
      login: "Lucifer13Freeman",
      url: "https://api.github.com/users/Lucifer13Freeman"
    }],
    total_count: 1
}

export const searchNoOneUserMock: ISearchUsersResponse = {
  incomplete_results: false,
  items: [],
  total_count: 0
}