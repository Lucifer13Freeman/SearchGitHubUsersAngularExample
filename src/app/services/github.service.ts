import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetListByLoginDto } from '../dto/get-list-by-login.dto';
import { ISearchUsersResponse } from '../interfaces/search-users-response.interface';
import { IRepo } from '../interfaces/repo.interface';
import { IUser } from '../interfaces/user.interface';
import { IUserShort } from '../interfaces/user-short';


@Injectable({
  providedIn: 'root'
})
export class GithubService {
  
  private static getUserUrl = `${environment.API_BASE_URL}users/`;
  private static searchUsersUrl = `${environment.API_BASE_URL}search/users?q=`;

  constructor(private readonly http: HttpClient) {}

  getUserByLogin(login: string): Observable<IUser> {
    const url = GithubService.getUserUrl + login;
    return this.http.get<IUser>(url);
  }

  searchUsersByLogin(dto: GetListByLoginDto): Observable<ISearchUsersResponse> {
    const { login, page, perPage } = dto;
    const url = `${GithubService.searchUsersUrl}${login}&per_page=${perPage}&page=${page}`;
    return this.http.get<ISearchUsersResponse>(url);
  }

  getFollowersByUserLogin(dto: GetListByLoginDto): Observable<IUserShort[]> {
    const { login, page, perPage } = dto;
    const url = `${GithubService.getUserUrl}${login}/followers?per_page=${perPage}&page=${page}`;
    return this.http.get<IUserShort[]>(url);
  }

  getReposByUserLogin(dto: GetListByLoginDto): Observable<IRepo[]> {
    const { login, page, perPage } = dto;
    const url = `${GithubService.getUserUrl}${login}/repos?per_page=${perPage}&page=${page}`;
    return this.http.get<IRepo[]>(url);
  }

  getFollowingByUserLogin(dto: GetListByLoginDto): Observable<IUserShort[]> {
    const { login, page, perPage } = dto;
    const url = `${GithubService.getUserUrl}${login}/following?per_page=${perPage}&page=${page}`;
    return this.http.get<IUserShort[]>(url);
  }
}
