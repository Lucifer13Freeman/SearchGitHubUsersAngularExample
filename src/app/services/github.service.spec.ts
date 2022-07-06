import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISearchUsersResponse } from '../interfaces/search-users-response.interface';
import { IUser } from '../interfaces/user.interface';
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
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send request to api', () => {
    const login = 'Lucifer13Freeman';
    const page = 1;
    const perPage = 20;
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsers({ login, page, perPage });

    users$.subscribe({
      next: (res: ISearchUsersResponse) => {
        expect(res.items.length).toBe(1);
        expect(res.total_count).toBe(1);
        expect(res.items[0]).toBeDefined();
      },
      error: (err: HttpErrorResponse) => console.error(err)
    });

    const url = `${searchUrl}${login}&per_page=${perPage}&page=${page}`;

    const req = httpMock.expectOne(url, 'Call to API');
    expect(req.request.method).toBe('GET');
  })
});
