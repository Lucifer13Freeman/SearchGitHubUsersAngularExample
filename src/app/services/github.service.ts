import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repo } from '../models/repo.model';
import { User } from '../models/user.model';


interface ISearchResponse
{
  items: User[];
  incomplete_results: boolean;
  total_count: number;
}

@Injectable(
{
  providedIn: 'root'
})
export class GithubService 
{
  static getUserUrl = 'https://api.github.com/users/';
  static searchUsersUrl = 'https://api.github.com/search/users?q=';

  constructor(private http: HttpClient) {}

  getUser(name: string): Observable<User> 
  {
    const url = GithubService.getUserUrl + name;
    return this.http.get<User>(url);
  }

  searchUsers(name: string): Observable<ISearchResponse>
  {
    const url = GithubService.searchUsersUrl + name;
    return this.http.get<ISearchResponse>(url);
  }

  getFollowersByUser(name: string, 
                    perPage: number = 100, 
                    page: number = 1): Observable<User[]>
  {
    const url = `${GithubService.getUserUrl}${name}/followers?per_page=${perPage}&page=${page}`;
    return this.http.get<User[]>(url);
  }

  getReposByUser(name: string, 
                perPage: number = 100, 
                page: number = 1): Observable<Repo[]>
  {
    const url = `${GithubService.getUserUrl}${name}/repos?per_page=${perPage}&page=${page}`;
    return this.http.get<Repo[]>(url);
  }

  getSubscriptionsByUser(name: string, 
                        perPage: number = 100, 
                        page: number = 1): Observable<Repo[]>
  {
    const url = `${GithubService.getUserUrl}${name}/repos?per_page=${perPage}&page=${page}`;
    return this.http.get<Repo[]>(url);
  }
}
