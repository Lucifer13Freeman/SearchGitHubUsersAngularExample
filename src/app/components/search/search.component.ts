import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, 
        filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ISearchUsersResponse } from 'src/app/interfaces/search-users-response.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { Pageable } from 'src/app/models/pageable.model';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private DEBOUNCE: number = 500;
  private USERS_PER_PAGE: number = 20;
  
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private searchText: string = '';

  public searchInput = new FormControl();
  public pageable!: Pageable;

  public users: IUser[] = [];
  public error: boolean = false;

  public loading$ = this.loadingService.getLoading();

  constructor(private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void { 
    this.pageable = new Pageable(this.USERS_PER_PAGE);
    this.searchUsers();
  }

  public searchUsers() {
    this.searchInput.valueChanges
      .pipe(
        map((searchText: string) => {
          const text = searchText.trim();
          if (text === '') {
            this.clearUsers();
            this.error = false;
          }
          return text;
        }),
        debounceTime(this.DEBOUNCE),
        distinctUntilChanged(),
        filter((searchText: string) => searchText !== ''),
        switchMap((searchText: string) => { 
          this.searchText = searchText;

          return this.githubService.searchUsers({ 
            login: searchText, 
            page: this.pageable.currentPage,
            perPage: this.pageable.maxPerPage 
          });
        }),
        takeUntil(this.destroyed$),
        catchError(err => this.onError())
      )
      .subscribe({
        next: (res: ISearchUsersResponse) => {
          this.users = [...res.items];
          this.pageable.totalItemsCount = res.total_count;
          this.error = res.items.length === 0;
        },
        error: err => this.onError()
      });
  }
  
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private clearUsers() {
    this.users = [];
    this.pageable.currentPage = 1;
    this.pageable.totalItemsCount = 0;
  }

  private onError() {
    this.clearUsers();
    this.error = true;
    return EMPTY;
  }

  public loadMore() {
    this.pageable.currentPage++;
    
    this.githubService.searchUsers({ 
      login: this.searchText, 
      page: this.pageable.currentPage,
      perPage: this.pageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError(err => this.onError())
    )
    .subscribe({
      next: res => {
        this.users.push(...res.items);
        this.error = false;
      },
      error: err => this.onError()
    });
  }

  public showLoadMoreBtn() {
    return this.pageable.totalItemsCount !== 0 
          && this.pageable.totalItemsCount > this.users.length;
  }
}
