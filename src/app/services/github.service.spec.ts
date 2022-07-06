import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ISearchUsersResponse } from '../interfaces/search-users-response.interface';
import { GithubService } from './github.service';


describe('GitHubService', () => {
  let service: GithubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(GithubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find 1 user', () => {
    const testText = 'Lucifer13Freeman';
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsers({ login: testText });

    users$.subscribe({
      next: (res: ISearchUsersResponse) => {
        expect(res.items.length).toBe(1);
        expect(res.total_count).toBe(1);
        expect(res.items[0]).toBeDefined();
      },
      error: (err: HttpErrorResponse) => console.error(err)
    });
  })

  it('should find 66 users and show 20', () => {
    const testText = 'Lucifer13';
    
    const users$: Observable<ISearchUsersResponse> = service.searchUsers({ login: testText });

    users$.subscribe({
      next: (res: ISearchUsersResponse) => {
        expect(res.items.length).toBe(20);
        expect(res.total_count).toBe(66);
      },
      error: (err: HttpErrorResponse) => console.error(err)
    });
  })
});
