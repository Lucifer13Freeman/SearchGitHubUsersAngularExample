import { IRepo } from "src/app/interfaces/repo.interface";
import { ISearchUsersResponse } from "src/app/interfaces/search-users-response.interface";
import { IUserShort } from "src/app/interfaces/user-short";
import { IUser } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment";


export const searchTestUrl = `${environment.API_BASE_URL}search/users?q=`;
export const getUserTestUrl = `${environment.API_BASE_URL}users/`;

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

export const userMock: IUser = {
  avatar_url: "https://avatars.githubusercontent.com/u/78305978?v=4",
  html_url: "https://github.com/Lucifer13Freeman",
  id: 78305978,
  login: "Lucifer13Freeman",
  url: "https://api.github.com/users/Lucifer13Freeman",
  name: null,
  bio: null,
  public_repos: 21,
  public_gists: 0,
  followers: 0,
  following: 0
}

export const userReposMock: IRepo[] = [
  {
    id: 488817582,
    name: "AshenChess",
    full_name: "Lucifer13Freeman/AshenChess",
    html_url: "https://github.com/Lucifer13Freeman/AshenChess"
  }, {
    id: 453493030,
    name: "AshenNotes-Flutter-Django-Example",
    full_name: "Lucifer13Freeman/AshenNotes-Flutter-Django-Example",
    html_url: "https://github.com/Lucifer13Freeman/AshenNotes-Flutter-Django-Example"
  }, {
    id: 441998253,
    name: "AshenOne",
    full_name: "Lucifer13Freeman/AshenOne",
    html_url: "https://github.com/Lucifer13Freeman/AshenOne"
  }
]

export const userFollowersMock: IUserShort[] = [
  {
    id: 488817582,
    login: "ismailakdogan",
    avatar_url: "https://avatars.githubusercontent.com/u/2834604?v=4",
    html_url: "https://github.com/ismailakdogan",
    url: "https://api.github.com/users/ismailakdogan"
  }, {
    id: 3578284,
    login: "pOmelchenko",
    avatar_url: "https://avatars.githubusercontent.com/u/3578284?v=4",
    html_url: "https://github.com/ismailakdogan",
    url: "https://api.github.com/users/pOmelchenko"
  }, {
    id: 3833507,
    login: "Amanntm",
    avatar_url: "https://avatars.githubusercontent.com/u/3833507?v=4",
    html_url: "https://github.com/Amanntm",
    url: "https://api.github.com/users/Amanntm"
  }
]

export const userFollowingMock: IUserShort[] = [
  {
    login: "Leneli",
    id: 10535059,
    avatar_url: "https://avatars.githubusercontent.com/u/10535059?v=4",
    url: "https://api.github.com/users/Leneli",
    html_url: "https://github.com/Leneli"
  },
  {
    login: "andreyalexeich",
    id: 36040108,
    avatar_url: "https://avatars.githubusercontent.com/u/36040108?v=4",
    url: "https://api.github.com/users/andreyalexeich",
    html_url: "https://github.com/andreyalexeich"
  }
]