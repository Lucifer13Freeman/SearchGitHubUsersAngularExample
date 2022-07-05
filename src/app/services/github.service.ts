import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetListByLoginDto } from '../dto/get-list-by-login.dto';
import { IUsersListResponse } from '../interfaces/users-list-response.interface';
import { IRepo } from '../interfaces/repo.interface';
import { IUser } from '../interfaces/user.interface';


@Injectable(
{
  providedIn: 'root'
})
export class GithubService 
{
  private static getUserUrl = `${environment.API_BASE_URL}users/`;
  private static searchUsersUrl = `${environment.API_BASE_URL}search/users?q=`;

  constructor(private readonly http: HttpClient) {}

  getUser(login: string): Observable<IUser> 
  {
    const url = GithubService.getUserUrl + login;
    return this.http.get<IUser>(url);
  }

  searchUsers(login: string): Observable<IUsersListResponse>
  {
    const url = GithubService.searchUsersUrl + login;
    return this.http.get<IUsersListResponse>(url);
  }

  getFollowersByUser(dto: GetListByLoginDto): Observable<IUser[]>
  {
    const { login, page, perPage } = dto;
    const url = `${GithubService.getUserUrl}${login}/followers?per_page=${perPage}&page=${page}`;
    return this.http.get<IUser[]>(url);
  }

  getReposByUser(dto: GetListByLoginDto): Observable<IRepo[]>
  {
    const { login, page, perPage } = dto;
    const url = `${GithubService.getUserUrl}${login}/repos?per_page=${perPage}&page=${page}`;
    return this.http.get<IRepo[]>(url);
  }

  getFollowingByUser(dto: GetListByLoginDto): Observable<IUser[]>
  {
    const { login, page, perPage } = dto;
    const url = `${GithubService.getUserUrl}${login}/following?per_page=${perPage}&page=${page}`;
    return this.http.get<IUser[]>(url);
  }
}
