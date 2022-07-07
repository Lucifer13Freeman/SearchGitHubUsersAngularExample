import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISearchUsersResponse } from '../interfaces/search-users-response.interface';
import { searchOneUserMock, findOneUserText, findNoOneUserText, searchNoOneUserMock } from '../test/mock-data/github-service.mock';
import { GithubService } from './github.service';


describe('GitHubService', () => {

  let service: GithubService;
  let httpMock: HttpTestingController;

  const searchUrl = `${environment.API_BASE_URL}search/users?q=`;

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
    const login = findOneUserText;
    const page = 1;
    const perPage = 20;

    const testData = searchOneUserMock;

    let res: ISearchUsersResponse;
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsers({ login, page, perPage });

    users$.subscribe({
      next: (receivedRes: ISearchUsersResponse) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${searchUrl}${login}&per_page=${perPage}&page=${page}`;
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

    const testData = searchNoOneUserMock;

    let res: ISearchUsersResponse;
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsers({ login, page, perPage });

    users$.subscribe({
      next: (receivedRes: ISearchUsersResponse) => res = receivedRes,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${searchUrl}${login}&per_page=${perPage}&page=${page}`;
    const req = httpMock.expectOne(url, 'Call to API');
    req.flush(testData);

    expect(req.request.method).toBe('GET');
    expect(res!.items.length).toBe(0);
    expect(res!.total_count).toBe(0);
    expect(res!.items[0]).toBeUndefined();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
