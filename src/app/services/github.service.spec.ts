import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { IRepo } from '../interfaces/repo.interface';
import { ISearchUsersResponse } from '../interfaces/search-users-response.interface';
import { IUserShort } from '../interfaces/user-short';
import { IUser } from '../interfaces/user.interface';
import { searchOneUserMock, testLogin, findNoOneUserText, 
      searchNoOneUserMock, userMock, searchTestUrl, getUserTestUrl, 
      userReposMock, userFollowersMock, testLogin2, userFollowingMock } from '../test/mock-data/github-service.mock';
import { GithubService } from './github.service';


describe('GitHubService', () => {

  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        GithubService
      ]
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find 1 user', () => {
    const login = testLogin;
    const page = 1;
    const perPage = 20;

    const testData = searchOneUserMock;

    let res: ISearchUsersResponse;
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsersByLogin({ login, page, perPage });

    users$.subscribe({
      next: (receivedRes: ISearchUsersResponse) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${searchTestUrl}${login}&per_page=${perPage}&page=${page}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(testData);

    expect(req.request.method).toBe('GET');
    expect(res!.items.length).toBe(1);
    expect(res!.total_count).toBe(1);
    expect(res!.items[0]).toBeDefined();
  });

  it('should find no one user', () => {
    const login = findNoOneUserText;
    const page = 1;
    const perPage = 20;

    let res: ISearchUsersResponse;
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsersByLogin({ login, page, perPage });

    users$.subscribe({
      next: (receivedRes: ISearchUsersResponse) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${searchTestUrl}${login}&per_page=${perPage}&page=${page}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(searchNoOneUserMock);

    expect(req.request.method).toBe('GET');
    expect(res!.items.length).toBe(0);
    expect(res!.total_count).toBe(0);
    expect(res!.items[0]).toBeUndefined();
  });

  it('should fetch user by login', () => {
    const login = testLogin;

    let res: IUser;
    
    const user$: Observable<IUser> = service.getUserByLogin(login);

    user$.subscribe({
      next: (receivedRes: IUser) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${getUserTestUrl}${login}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(userMock);

    expect(req.request.method).toBe('GET');
    expect(res!).toBeDefined();
    expect(res!).toEqual(userMock);
  });

  it('should fetch repos by user login', () => {
    const login = testLogin;
    const page = 1;
    const perPage = 3;

    let res: IRepo[];
    
    const repos$: Observable<IRepo[]> = service.getReposByUserLogin({ login, page, perPage });

    repos$.subscribe({
      next: (receivedRes: IRepo[]) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${getUserTestUrl}${login}/repos?per_page=${perPage}&page=${page}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(userReposMock);

    expect(req.request.method).toBe('GET');
    expect(res!).toBeDefined();
    expect(res!.length).toBe(perPage);
    expect(res!).toEqual(userReposMock);
  });

  it('should fetch followers by user login', () => {
    const login = testLogin2;
    const page = 1;
    const perPage = 3;

    let res: IUserShort[];
    
    const followers$: Observable<IUserShort[]> = service.getFollowersByUserLogin({ login, page, perPage });

    followers$.subscribe({
      next: (receivedRes: IUserShort[]) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${getUserTestUrl}${login}/followers?per_page=${perPage}&page=${page}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(userFollowersMock);

    expect(req.request.method).toBe('GET');
    expect(res!).toBeDefined();
    expect(res!.length).toBe(perPage);
    expect(res!).toEqual(userFollowersMock);
  });

  it('should fetch following by user login', () => {
    const login = testLogin;
    const page = 1;
    const perPage = 10;

    let res: IUserShort[];
    
    const followers$: Observable<IUserShort[]> = service.getFollowersByUserLogin({ login, page, perPage });

    followers$.subscribe({
      next: (receivedRes: IUserShort[]) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${getUserTestUrl}${login}/followers?per_page=${perPage}&page=${page}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(userFollowingMock);

    expect(req.request.method).toBe('GET');
    expect(res!).toBeDefined();
    expect(res!.length).toBe(2);
    expect(res!).toEqual(userFollowingMock);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
